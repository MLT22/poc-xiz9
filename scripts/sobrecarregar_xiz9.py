#!/usr/bin/env python3
"""Mantém a API do Xiz9 ocupada para testar o app com longo tempo de espera.

Cada worker envia a mesma imagem em sequência, sempre uma requisição por vez.
A análise pedida pelo app disputa o servidor com essas requisições e demora mais.

Uso:
    python3 scripts/sobrecarregar_xiz9.py foto.jpg --workers 8
"""

import argparse
import http.client
import json
import queue
import statistics
import sys
import threading
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

URL_PADRAO = "http://127.0.0.1:8000/Xiz9/analise"

# Os mesmos tipos aceitos pela API, pela extensão do arquivo.
TIPOS_ACEITOS = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
}


def montar_multipart(caminho, tipo):
    fronteira = uuid.uuid4().hex
    nome = caminho.name.replace('"', "_")
    cabecalho = (
        f"--{fronteira}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{nome}"\r\n'
        f"Content-Type: {tipo}\r\n\r\n"
    ).encode()
    corpo = cabecalho + caminho.read_bytes() + f"\r\n--{fronteira}--\r\n".encode()
    return corpo, f"multipart/form-data; boundary={fronteira}"


def enviar(url, corpo, tipo_conteudo, tempo_limite):
    """Devolve (status, segundos, detalhe). O status é None se não houve resposta."""
    requisicao = urllib.request.Request(
        url, data=corpo, headers={"Content-Type": tipo_conteudo}, method="POST"
    )
    inicio = time.monotonic()
    try:
        with urllib.request.urlopen(requisicao, timeout=tempo_limite) as resposta:
            status = resposta.status
            dados = json.loads(resposta.read())
        detalhe = f"{dados['label']} ({dados['confidence']:.2%})"
    except urllib.error.HTTPError as erro:
        status = erro.code
        detalhe = erro.read().decode(errors="replace")[:200]
    except (OSError, http.client.HTTPException, ValueError, KeyError, TypeError) as erro:
        status = None
        detalhe = f"{type(erro).__name__}: {erro}"
    return status, time.monotonic() - inicio, detalhe


def trabalhar(numero, args, corpo, tipo_conteudo, parar, resultados):
    while not parar.is_set():
        status, segundos, detalhe = enviar(args.url, corpo, tipo_conteudo, args.tempo_limite)
        resultados.put((numero, status, segundos, detalhe))
        # Sem resposta, a API pode estar fora do ar: espera para não girar sem parar.
        if status is None:
            parar.wait(1)


def imprimir_resumo(concluidas):
    print("\n--- Resumo ---")
    if not concluidas:
        print("Nenhuma requisição terminou.")
        return

    tempos_ok = [segundos for _, status, segundos, _ in concluidas if status == 200]
    print(f"Concluídas: {len(concluidas)} | sucesso: {len(tempos_ok)} | "
          f"falhas: {len(concluidas) - len(tempos_ok)}")
    if tempos_ok:
        print(f"Tempo com sucesso: média {statistics.mean(tempos_ok):.1f} s, "
              f"máximo {max(tempos_ok):.1f} s")


def ler_argumentos():
    parser = argparse.ArgumentParser(description="Sobrecarrega a API do Xiz9 com análises.")
    parser.add_argument("imagem", type=Path, help="imagem enviada em todas as requisições")
    parser.add_argument("--workers", type=int, default=8,
                        help="requisições simultâneas (padrão: 8)")
    parser.add_argument("--duracao", type=float, default=None,
                        help="segundos de execução (padrão: até Ctrl+C)")
    parser.add_argument("--tempo-limite", type=float, default=300,
                        help="segundos de espera por requisição (padrão: 300)")
    parser.add_argument("--url", default=URL_PADRAO, help=f"padrão: {URL_PADRAO}")
    args = parser.parse_args()

    if args.workers < 1:
        parser.error("--workers precisa ser pelo menos 1")
    if not args.imagem.is_file():
        parser.error(f"arquivo não encontrado: {args.imagem}")
    if args.imagem.suffix.lower() not in TIPOS_ACEITOS:
        parser.error(f"extensão não aceita pela API: {args.imagem.suffix or '(nenhuma)'}")
    return args


def main():
    args = ler_argumentos()
    corpo, tipo_conteudo = montar_multipart(args.imagem, TIPOS_ACEITOS[args.imagem.suffix.lower()])

    parar = threading.Event()
    resultados = queue.SimpleQueue()
    # Daemon: ao sair, o script não espera as análises que ainda estão em andamento.
    for numero in range(1, args.workers + 1):
        threading.Thread(
            target=trabalhar,
            args=(numero, args, corpo, tipo_conteudo, parar, resultados),
            daemon=True,
        ).start()

    print(f"{args.workers} workers enviando {args.imagem.name} para {args.url}")
    print("Toque em Analisar no app enquanto o script roda. Ctrl+C encerra.\n")

    limite = None if args.duracao is None else time.monotonic() + args.duracao
    concluidas = []
    try:
        while limite is None or time.monotonic() < limite:
            try:
                resultado = resultados.get(timeout=0.5)
            except queue.Empty:
                continue
            concluidas = [*concluidas, resultado]
            numero, status, segundos, detalhe = resultado
            print(f"[worker {numero}] {status or 'sem resposta'} em {segundos:.1f} s: {detalhe}")
    except KeyboardInterrupt:
        pass

    parar.set()
    imprimir_resumo(concluidas)


if __name__ == "__main__":
    sys.exit(main())
