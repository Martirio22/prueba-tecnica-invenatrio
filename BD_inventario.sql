USE master;
GO

IF DB_ID('InventarioMicroserviciosDB') IS NOT NULL
BEGIN
    ALTER DATABASE InventarioMicroserviciosDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE InventarioMicroserviciosDB;
END
GO

CREATE DATABASE InventarioMicroserviciosDB;
GO

USE InventarioMicroserviciosDB;
GO

CREATE TABLE Categoria
(
    IdCategoria INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(250) NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE Producto
(
    IdProducto INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    IdCategoria INT NOT NULL,
    ImagenUrl NVARCHAR(500) NULL,
    Precio DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL,
    Estado BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Producto_Categoria
        FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria),

    CONSTRAINT CK_Producto_Precio
        CHECK (Precio >= 0),

    CONSTRAINT CK_Producto_Stock
        CHECK (Stock >= 0)
);
GO

CREATE TABLE TransaccionInventario
(
    IdTransaccionInventario BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TipoTransaccion NVARCHAR(20) NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    PrecioTotal DECIMAL(18,2) NOT NULL,
    Detalle NVARCHAR(500) NULL,

    CONSTRAINT FK_TransaccionInventario_Producto
        FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto),

    CONSTRAINT CK_TransaccionInventario_Tipo
        CHECK (TipoTransaccion IN ('Compra', 'Venta')),

    CONSTRAINT CK_TransaccionInventario_Cantidad
        CHECK (Cantidad > 0),

    CONSTRAINT CK_TransaccionInventario_PrecioUnitario
        CHECK (PrecioUnitario >= 0),

    CONSTRAINT CK_TransaccionInventario_PrecioTotal
        CHECK (PrecioTotal >= 0)
);
GO

CREATE INDEX IX_Producto_IdCategoria
    ON Producto(IdCategoria);
GO

CREATE INDEX IX_TransaccionInventario_IdProducto
    ON TransaccionInventario(IdProducto);
GO

CREATE INDEX IX_TransaccionInventario_Fecha
    ON TransaccionInventario(Fecha);
GO

CREATE INDEX IX_TransaccionInventario_TipoTransaccion
    ON TransaccionInventario(TipoTransaccion);
GO

