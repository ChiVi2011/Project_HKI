USE ViDairyDB
go

-- =====================================================
-- TABLE: Users
-- MODULE: Authentication
-- =====================================================
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerCode VARCHAR(20) NOT NULL UNIQUE,
    Username VARCHAR(100) NOT NULL UNIQUE,
    FullName NVARCHAR(100) NOT NULL,
    Gender BIT NULL,
    DateOfBirth DATE NULL,
    Phone VARCHAR(15) NULL UNIQUE,
    Email VARCHAR(100) NULL UNIQUE,
    Avatar VARCHAR(255) NULL,
    Status BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);

ALTER TABLE Users
ADD UserType VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER';

SELECT * FROM Users


-- =====================================================
-- TABLE: Passwwork
-- MODULE: Authentication
-- =====================================================
CREATE TABLE Passwords (
	PasswordID INT IDENTITY(1,1) PRIMARY KEY,
	UserID INT NOT NULL UNIQUE,
	PasswordHash VARCHAR(255) NOT NULL,
	PasswordAlgorithm VARCHAR(20) NOT NULL DEFAULT 'bcrypt',
	LastChangedAt DATETIME NOT NULL DEFAULT GETDATE(),
	CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
	  CONSTRAINT FK_Passwords_Users
			FOREIGN KEY (UserID) REFERENCES Users(UserID)
)
-- =====================================================
-- TABLE: Categories
-- MODULE: Products
-- =====================================================

CREATE TABLE Categories (
	CategoryID INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName NVARCHAR(100) NOT NULL UNIQUE,
	ParentCategoryID    INT NULL,
	[Status]            BIT NOT NULL DEFAULT 1,
	CreatedAt           DATETIME NOT NULL DEFAULT GETDATE(),
	UpdatedAt           DATETIME NOT NULL DEFAULT GETDATE(),

	CONSTRAINT FK_Categories_ParentCategory FOREIGN KEY (ParentCategoryID)
			REFERENCES Categories(CategoryID)
)
ALTER TABLE Categories
ADD CategoryCode VARCHAR(20) NOT NULL UNIQUE;
-- =====================================================
-- TABLE: Brands
-- MODULE: Products
-- =====================================================
CREATE TABLE Brands(
	BrandID INT IDENTITY(1,1) PRIMARY KEY,	
	BrandName NVARCHAR(100) NOT NULL UNIQUE,
	[Description] NVARCHAR(500) NULL,
	[Status] BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
)
ALTER TABLE Brands
ADD BrandCode VARCHAR(20) NOT NULL UNIQUE;
SELECT * FROM Brands

-- =====================================================
-- TABLE: Products
-- MODULE: Products
-- =====================================================
CREATE TABLE Products(
	ProductID INT IDENTITY(1,1) PRIMARY KEY,	
	ProductCode VARCHAR(30) NOT NULL UNIQUE,
	ProductName NVARCHAR(100) NOT NULL,
	CategoryID INT NOT NULL,
	BrandID INT NOT NULL,
	[Description] NVARCHAR(500),
	[Status] BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),

	CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryID)
    REFERENCES Categories(CategoryID),

	CONSTRAINT FK_Product_Brand FOREIGN KEY (BrandID)
    REFERENCES Brands(BrandID)
)
SELECT * FROM Products

-- =====================================================
-- TABLE: ProductVariants
-- MODULE: Products
-- =====================================================
CREATE TABLE ProductVariants(
	VariantID INT IDENTITY(1,1) PRIMARY KEY,
	ProductID INT NOT NULL,
	SKU VARCHAR(50) NOT NULL UNIQUE,
	VariantName NVARCHAR(100) NOT NULL,
	[Weight] DECIMAL(8,2) NULL,
	Volume DECIMAL(8,2) NULL,
	Unit NVARCHAR(10) NOT NULL,
	Price DECIMAL(18,2) NOT NULL,
	Barcode VARCHAR(50) NULL,
	[Status] BIT NOT NULL DEFAULT 1,
	CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
	UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),

	CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (ProductID)
			REFERENCES Products(ProductID),
	CONSTRAINT CK_Variant_WeightOrVolume CHECK (
    ([Weight] IS NOT NULL AND Volume IS NULL) OR 
    ([Weight] IS NULL AND Volume IS NOT NULL)),
	CONSTRAINT CK_Variant_Price CHECK (Price > 0)
)
SELECT * FROM ProductVariants

-- =====================================================
-- TABLE: ProductImages
-- MODULE: Products
-- =====================================================
CREATE TABLE ProductImages(
    ImageID INT IDENTITY(1,1) PRIMARY KEY,
    VariantID INT NOT NULL,
    ImageURL NVARCHAR(255) NOT NULL,
    AltText NVARCHAR(255) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsPrimary BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
	UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_ProductImages_ProductVariants
        FOREIGN KEY (VariantID)
        REFERENCES ProductVariants(VariantID),

    CONSTRAINT CK_ProductImages_DisplayOrder
        CHECK (DisplayOrder > 0)
);
SELECT * FROM ProductImages