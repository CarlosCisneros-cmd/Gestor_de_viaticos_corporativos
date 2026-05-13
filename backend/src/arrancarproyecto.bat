@echo off
title Iniciando GestorVC - Sequelize
start cmd.exe /k "cd C:\Node\GestorVC\backend && npm start"
start cmd.exe /k "cd C:\Program Files\MongoDB\Server\8.2\bin && mongod.exe --dbpath C:\data8\db"
