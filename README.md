## Requisitos

Para ejecutar correctamente el proyecto, es necesario contar con lo siguiente:

- .NET 10
- Angular 21
- SQL Server

Además, se debe ejecutar el archivo `.sql` incluido en el proyecto para crear la base de datos correspondiente.

---

## Configuración de la base de datos

Antes de iniciar la aplicación, asegúrese de:

1. Tener una instancia de SQL Server disponible.
2. Ejecutar el script SQL incluido en el proyecto.
3. Verificar que la base de datos se haya creado correctamente.

---

## Ejecución del backend

La solución cuenta con dos proyectos API:

- `ProductsService`
- `TransactionService`

Antes de ejecutar los servicios, debe configurar la cadena de conexión en cada uno de ellos.

### Configuración de `appsettings.json`

En el proyecto `ProductsService`, dentro del archivo `appsettings.json`, reemplace la cadena de conexión por la correspondiente a la instancia de SQL Server de su equipo.

Realice esta misma configuración en el proyecto `TransactionService`.

### Importante

Ambos proyectos API deben ejecutarse al mismo tiempo para que la solución funcione correctamente.

Puede hacerlo de dos maneras:

- Ejecutando ambos proyectos manualmente.
- Configurando la solución para que inicie ambos proyectos al mismo tiempo desde la opción **Configuración de proyectos de inicio** en Visual Studio.

En esa opción, debe seleccionar **Varios proyectos de inicio** y establecer ambos proyectos API con la acción **Iniciar**.

---

## Ejecución del frontend

Una vez que el backend se encuentre en ejecución, debe iniciar el frontend.

Para ello:

1. Abra una terminal en la raíz del proyecto frontend.
2. Ejecute el siguiente comando para instalar las dependencias:

```bash
npm i

3. Después de completar la instalación, ejecute el siguiente comando para iniciar la aplicación:

ng serve -o