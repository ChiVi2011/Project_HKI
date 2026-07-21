# API Specification

- Base URL : ``
- API Version: `V1`
- Authentication: `JWT Bearer Token`
- Response Format: `JSON`
- Error Code: `HTTP Status Codes`

## 2. Authentication API

### Login

Request

```json
{
    "username": "admin",
    "password": "123456"
}
```

Response

```json
{
    "success": true,
    "token": "...",
    "refreshToken": "...",
    "user": {}
}
```

## 3. User API
    GET /api/users
    GET /api/users/{id}
    POST /api/users
    PUT /api/users/{id}
    DELETE /api/users/{id}

## 4. Category API
    GET /api/categories
    GET /api/categories/{id}
    POST /api/categories
    PUT /api/categories/{id}
    DELETE /api/categories/{id}

## 5. Brand API
    GET /api/brands
    POST /api/brands
    PUT /api/brands/{id}
    DELETE /api/brands/{id}

## 6. Product API
    GET /api/products
    GET /api/products/{id}
    POST /api/products
    PUT /api/products/{id}
    DELETE /api/products/{id}

## 7. Product Variant API
    GET /api/product-variants
    POST /api/product-variants
    PUT /api/product-variants/{id}
    DELETE /api/product-variants/{id}

## 8. Product Image API
    GET /api/product-images
    POST /api/product-images
    DELETE /api/product-images/{id}

## 9. Warehouse API
    GET /api/warehouses
    POST /api/warehouses
    PUT /api/warehouses/{id}
    DELETE /api/warehouses/{id}

## 10. Inventory API
    GET /api/inventory
    POST /api/inventory/import
    POST /api/inventory/export

## 11. Batch API
    GET /api/product-batches
    POST /api/product-batches
    PUT /api/product-batches/{id}
    DELETE /api/product-batches/{id}

## 12. Supplier API
    GET /api/suppliers
    POST /api/suppliers
    PUT /api/suppliers/{id}
    DELETE /api/suppliers/{id}

## 13. Purchase Order API
    GET /api/purchase-orders
    POST /api/purchase-orders
    GET /api/purchase-orders/{id}

## 14. Cart API
    GET /api/cart
    POST /api/cart
    PUT /api/cart/items/{id}
    DELETE /api/cart/items/{id}

## 15. Order API
    GET /api/orders
    GET /api/orders/{id}
    POST /api/orders
    PUT /api/orders/{id}/status

## 16. Payment API
    POST /api/payments
    GET /api/payments/{id}
    POST /api/payments/callback

## 17. Shipping API
    GET /api/shipping-methods
    POST /api/shipments
    PUT /api/shipments/{id}

## 18. Coupon API
    GET /api/coupons
    POST /api/coupons
    PUT /api/coupons/{id}
    DELETE /api/coupons/{id}

## 19. Promotion API
    GET /api/promotions
    POST /api/promotions
    PUT /api/promotions/{id}
    DELETE /api/promotions/{id}

## 20. Review API
    GET /api/reviews
    POST /api/reviews
    PUT /api/reviews/{id}
    DELETE /api/reviews/{id}


## 21. Banner API
    GET /api/banners
    POST /api/banners
    PUT /api/banners/{id}
    DELETE /api/banners/{id}

## 22. News API
    GET /api/news
    GET /api/news/{id}
    POST /api/news
    PUT /api/news/{id}
    DELETE /api/news/{id}

## 23. Notification API
    GET /api/notifications
    PUT /api/notifications/{id}/read

## 24. Audit Log API
    GET /api/audit-logs

## 25. Settings API
    GET /api/settings
    PUT /api/settings