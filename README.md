# Sideroca

Sideroca (Simplifying Interactions and Dynamic Enhancements for Remarkable Outcomes in Card Acquisition) is a full-stack web application built using Next.js and FastAPI. The app serves as a user interface to interact with a PostgreSQL database containing the trading card dumps provided by NationStates.

Sideroca does not aim to replicate or dream to match r3n's card queries, but it does seek to provide similar functionalities by enabling users to retrieve cards based on desired parameters.

### Why is this called Sideroca?
I already owned a domain sideroca.com and was not using it.

<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"> <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"> <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"> 

<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi"> 

<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white">

## 🔧 Local Install
If you have the technical understanding to run this yourself, I'd appreciate it. Since I made it that means self-hosting it cannot be too difficult. 

You can either spin up Docker containers from the compose (adding the ports to front and back to skip Nginx configuration) or run each by themselves. 

The latter will require running generate_sqlite.py and installing Redis onto your system. If you don't want Redis, remove all Redis related code from FastAPI.