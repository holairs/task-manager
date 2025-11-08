# Backend
## Comando poder instalar librerias local y no en toda la computadora:
Dentro de la carpeta raíz
```sh
dotnet new tool-manifest
```

## Comando instalar la librería  de ORM y de MySQL:
Dentro de la carpeta raíz
```sh
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.7
dotnet add package MySql.Data.EntityFrameworkCore;
```

## Comando para crear una migración nueva: 
Dentro de la carpeta raíz
```sh
dotnet ef migrations add MigracionInitial
```

## Comando para actualizar la base de datos con la migración:
Dentro de la carpeta raíz
```sh
 dotnet ef database update
```

# Frontend

## Para instalar las dependéncias de NODE
Dentro de la carpeta raíz
```sh
 npm install
```

## Para iniciar el servidor del UI
Dentro de la carpeta raíz
```sh
 npm run dev
```
