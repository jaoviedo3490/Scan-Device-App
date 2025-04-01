import sys

def readFile(ruta):
    try:
        with open(ruta,"r",encoding="utf8") as file:
            contenido = file.read()
            print(contenido)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    ruta = sys.argv[1]
    readFile(ruta)


