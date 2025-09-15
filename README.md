# 🔎 Scanner de Red - Backend + Frontend

![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![C++](https://img.shields.io/badge/C++-Crow-blue?logo=c%2b%2b)
![Bootstrap](https://img.shields.io/badge/Frontend-Bootstrap-purple?logo=bootstrap)
![WSL](https://img.shields.io/badge/WSL-Ubuntu-orange?logo=ubuntu)

---

## 📌 Descripción
Aplicación ligera que permite **escanear dispositivos conectados a la red local** mediante [`nmap`](https://nmap.org/) ejecutado en **WSL (Ubuntu en Windows)**, y obtener información detallada de cada equipo a través de un **agente remoto en C++ con [Crow](https://crowcpp.org/)**.  

Aunque es un proyecto **monolítico**, sigue un patrón **MVC híbrido** con separación de lógica cliente-servidor:  
- El **backend (Express)** expone APIs REST.  
- El **frontend (Bootstrap)** consume esas APIs.  
- El **agente remoto** ejecuta comandos en el sistema anfitrión (ej. CMD en Windows) y devuelve la información al backend.  

---

## ✨ Funcionalidades
✔️ Escaneo de dispositivos en la **red local** con `nmap` en WSL.  
✔️ Comunicación con un **agente remoto en C++/Crow** instalado en cada dispositivo.  
✔️ Visualización en frontend de información recolectada:  
   - 💻 Procesador  
   - 🧠 Memoria RAM  
   - 💾 Disco(s)  
   - 🧬 BIOS  
   - 🎹 Periféricos  
✔️ Detección automática de `nmap` en la máquina local.  
✔️ Instalación automática o manual de `nmap` en WSL.  
---
## ⚙️ Cómo funciona
1. El usuario inicia un escaneo desde el frontend.  
2. El backend ejecuta `nmap` en **WSL (Ubuntu en Windows)** para listar dispositivos activos en la red local.  
3. Para cada dispositivo con agente, se realiza una petición HTTP al puerto `8080`.  
4. El **agente remoto (Crow + C++)** obtiene datos del sistema y responde en JSON.  
5. El backend procesa la información y la expone en APIs REST que consume el frontend

---
## 🚧 Limitaciones actuales
- Solo detecta dispositivos dentro de la **red local**.  
- El agente debe estar **instalado y en ejecución** en el dispositivo remoto para obtener información del sistema.
---
## 🚀 Futuras implementaciones
🔹 Soporte para **VPN** → detectar dispositivos en redes remotas.  
🔹 Persistencia en base de datos → mantener histórico de escaneos.  
🔹 Dashboard avanzado con **estadísticas y alertas en tiempo real**.  
🔹 Integración con **Docker** para despliegue más sencillo.  
🔹 Separar el **frontend en una aplicación independiente hecha en React**, dejando de ser un proyecto monolítico y adoptando un enfoque moderno de **backend + frontend desacoplados**.  

