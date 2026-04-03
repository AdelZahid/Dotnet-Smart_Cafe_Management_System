-- =============================================
-- CAFE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CafeManagementDB')
BEGIN
    CREATE DATABASE CafeManagementDB;
END
GO

USE CafeManagementDB;
GO

-- =============================================
-- DROP TABLES IF EXISTS (for clean setup)
-- =============================================
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE Payments;
IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('dbo.Reservations', 'U') IS NOT NULL DROP TABLE Reservations;
IF OBJECT_ID('dbo.Tables', 'U') IS NOT NULL DROP TABLE Tables;
IF OBJECT_ID('dbo.IngredientUsage', 'U') IS NOT NULL DROP TABLE IngredientUsage;
IF OBJECT_ID('dbo.IngredientPurchases', 'U') IS NOT NULL DROP TABLE IngredientPurchases;
IF OBJECT_ID('dbo.Ingredients', 'U') IS NOT NULL DROP TABLE Ingredients;
IF OBJECT_ID('dbo.AdditionalCosts', 'U') IS NOT NULL DROP TABLE AdditionalCosts;
IF OBJECT_ID('dbo.ItemCategories', 'U') IS NOT NULL DROP TABLE ItemCategories;
IF OBJECT_ID('dbo.MenuItems', 'U') IS NOT NULL DROP TABLE MenuItems;
IF OBJECT_ID('dbo.Attendance', 'U') IS NOT NULL DROP TABLE Attendance;
IF OBJECT_ID('dbo.SalaryPayments', 'U') IS NOT NULL DROP TABLE SalaryPayments;
IF OBJECT_ID('dbo.Employees', 'U') IS NOT NULL DROP TABLE Employees;
IF OBJECT_ID('dbo.CafeProfiles', 'U') IS NOT NULL DROP TABLE CafeProfiles;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- =============================================
-- USERS TABLE (For Authentication)
-- =============================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NULL, -- NULL for Google OAuth users
    GoogleId NVARCHAR(255) NULL,
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('Manager', 'Waiter')),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL
);
GO

-- =============================================
-- CAFE PROFILES TABLE
-- =============================================
CREATE TABLE CafeProfiles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OwnerId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
    CafeName NVARCHAR(200) NOT NULL,
    OwnerName NVARCHAR(200) NOT NULL,
    Location NVARCHAR(500) NOT NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(255) NULL,
    ImageUrl NVARCHAR(500) NULL,
    Description NVARCHAR(1000) NULL,
    OpeningTime TIME NULL,
    ClosingTime TIME NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- EMPLOYEES TABLE
-- =============================================
CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE SET NULL,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    EmployeeId NVARCHAR(20) NOT NULL UNIQUE, -- Format: EMP + 5 digits (e.g., EMP12345)
    Name NVARCHAR(200) NOT NULL,
    Age INT NULL CHECK (Age >= 18 AND Age <= 70),
    Sex NVARCHAR(10) NULL CHECK (Sex IN ('Male', 'Female', 'Other')),
    Address NVARCHAR(500) NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(50) NULL,
    ImageUrl NVARCHAR(500) NULL,
    Designation NVARCHAR(100) NOT NULL CHECK (Designation IN ('Manager', 'Waiter', 'Chef', 'Cashier')),
    Shift NVARCHAR(50) NULL CHECK (Shift IN ('Morning', 'Evening', 'Night', 'FullDay')),
    Salary DECIMAL(18,2) NOT NULL DEFAULT 0,
    JoiningDate DATE DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- ATTENDANCE TABLE
-- =============================================
CREATE TABLE Attendance (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT NOT NULL FOREIGN KEY REFERENCES Employees(Id) ON DELETE CASCADE,
    Date DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Present', 'Absent', 'Late', 'HalfDay')),
    CheckInTime TIME NULL,
    CheckOutTime TIME NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UNIQUE(EmployeeId, Date)
);
GO

-- =============================================
-- SALARY PAYMENTS TABLE
-- =============================================
CREATE TABLE SalaryPayments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT NOT NULL FOREIGN KEY REFERENCES Employees(Id) ON DELETE CASCADE,
    Month INT NOT NULL CHECK (Month >= 1 AND Month <= 12),
    Year INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    IsPaid BIT DEFAULT 0,
    PaidDate DATE NULL,
    PaymentMethod NVARCHAR(50) NULL CHECK (PaymentMethod IN ('Cash', 'Bank Transfer', 'Mobile Banking')),
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UNIQUE(EmployeeId, Month, Year)
);
GO

-- =============================================
-- ITEM CATEGORIES TABLE
-- =============================================
CREATE TABLE ItemCategories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- MENU ITEMS TABLE
-- =============================================
CREATE TABLE MenuItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    CategoryId INT NULL FOREIGN KEY REFERENCES ItemCategories(Id) ON DELETE SET NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    ImageUrl NVARCHAR(500) NULL,
    PriceRange NVARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN UnitPrice < 100 THEN 'Low'
            WHEN UnitPrice >= 100 AND UnitPrice < 300 THEN 'Medium'
            ELSE 'High'
        END
    ) PERSISTED,
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- TABLES (PHYSICAL TABLES IN CAFE)
-- =============================================
CREATE TABLE Tables (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    TableNumber NVARCHAR(20) NOT NULL,
    Capacity INT NOT NULL DEFAULT 4,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UNIQUE(CafeId, TableNumber)
);
GO

-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE Reservations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    TableId INT NOT NULL FOREIGN KEY REFERENCES Tables(Id),
    CustomerName NVARCHAR(200) NOT NULL,
    CustomerPhone NVARCHAR(50) NOT NULL,
    CustomerEmail NVARCHAR(255) NULL,
    ReservationDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    NumberOfGuests INT NOT NULL DEFAULT 2,
    Notes NVARCHAR(500) NULL,
    Status NVARCHAR(20) DEFAULT 'Confirmed' CHECK (Status IN ('Confirmed', 'Cancelled', 'Completed')),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    TableId INT NULL FOREIGN KEY REFERENCES Tables(Id) ON DELETE SET NULL,
    WaiterId INT NULL FOREIGN KEY REFERENCES Employees(Id) ON DELETE SET NULL,
    OrderType NVARCHAR(20) NOT NULL CHECK (OrderType IN ('DineIn', 'Online', 'Takeaway')),
    CustomerName NVARCHAR(200) NULL,
    CustomerPhone NVARCHAR(50) NULL,
    CustomerAddress NVARCHAR(500) NULL,
    OrderDate DATETIME2 DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Processing', 'Ready', 'Served', 'Cancelled', 'Refunded')),
    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsPaid BIT DEFAULT 0,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    MenuItemId INT NOT NULL FOREIGN KEY REFERENCES MenuItems(Id),
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice AS (Quantity * UnitPrice) PERSISTED,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    Amount DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL CHECK (PaymentMethod IN ('Cash', 'Card', 'Mobile Banking', 'Online')),
    PaymentDate DATETIME2 DEFAULT GETDATE(),
    TransactionId NVARCHAR(100) NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- INGREDIENTS TABLE
-- =============================================
CREATE TABLE Ingredients (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    Name NVARCHAR(200) NOT NULL,
    UnitOfMeasure NVARCHAR(50) NOT NULL, -- kg, liter, piece, etc.
    CurrentStock DECIMAL(18,2) DEFAULT 0,
    MinStockLevel DECIMAL(18,2) DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- INGREDIENT PURCHASES TABLE
-- =============================================
CREATE TABLE IngredientPurchases (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IngredientId INT NOT NULL FOREIGN KEY REFERENCES Ingredients(Id) ON DELETE CASCADE,
    PurchaseDate DATE NOT NULL DEFAULT GETDATE(),
    Quantity DECIMAL(18,2) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalCost AS (Quantity * UnitPrice) PERSISTED,
    SupplierName NVARCHAR(200) NULL,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- INGREDIENT USAGE TABLE (Daily Usage Tracking)
-- =============================================
CREATE TABLE IngredientUsage (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IngredientId INT NOT NULL FOREIGN KEY REFERENCES Ingredients(Id) ON DELETE CASCADE,
    UsageDate DATE NOT NULL DEFAULT GETDATE(),
    QuantityUsed DECIMAL(18,2) NOT NULL DEFAULT 0,
    QuantityWasted DECIMAL(18,2) DEFAULT 0,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UNIQUE(IngredientId, UsageDate)
);
GO

-- =============================================
-- ADDITIONAL COSTS TABLE (Bills, Utilities, etc.)
-- =============================================
CREATE TABLE AdditionalCosts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CafeId INT NOT NULL FOREIGN KEY REFERENCES CafeProfiles(Id) ON DELETE CASCADE,
    CostType NVARCHAR(100) NOT NULL, -- Electricity, Gas, Rent, etc.
    Amount DECIMAL(18,2) NOT NULL,
    CostDate DATE NOT NULL,
    Description NVARCHAR(500) NULL,
    IsRecurring BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IX_Employees_CafeId ON Employees(CafeId);
CREATE INDEX IX_Employees_Designation ON Employees(Designation);
CREATE INDEX IX_Orders_CafeId ON Orders(CafeId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_Orders_WaiterId ON Orders(WaiterId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_Attendance_EmployeeId_Date ON Attendance(EmployeeId, Date);
CREATE INDEX IX_SalaryPayments_EmployeeId ON SalaryPayments(EmployeeId);
CREATE INDEX IX_IngredientUsage_Date ON IngredientUsage(UsageDate);
CREATE INDEX IX_IngredientPurchases_Date ON IngredientPurchases(PurchaseDate);
CREATE INDEX IX_AdditionalCosts_Date ON AdditionalCosts(CostDate);
CREATE INDEX IX_Reservations_Date ON Reservations(ReservationDate);
GO

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default categories
INSERT INTO ItemCategories (CafeId, Name, Description) VALUES 
(1, 'Beverages', 'Coffee, Tea, and other drinks'),
(1, 'Snacks', 'Light snacks and appetizers'),
(1, 'Main Course', 'Full meals and main dishes'),
(1, 'Desserts', 'Sweet treats and desserts');
GO

PRINT 'Database Schema Created Successfully!';
