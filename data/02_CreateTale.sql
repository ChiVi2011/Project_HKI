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
