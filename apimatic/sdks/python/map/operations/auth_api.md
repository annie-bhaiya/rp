<!-- Generated file — do not edit; regenerated with the SDK. -->

# AuthApi — operations

Accessor: `client.auth_api` · Source: `resolve_pay_rescue_api/apis/auth_api.py` · 8 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.auth_api.auth_controller_config

- **Route**: `GET /api/v1/auth/config`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_config(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_get_session

- **Route**: `GET /api/v1/auth/session`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_get_session(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_login_dev

- **Route**: `POST /api/v1/auth/login-dev`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_login_dev(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_logout

- **Route**: `POST /api/v1/auth/logout`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_logout(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_redeem_access

- **Route**: `POST /api/v1/auth/customer/access/redeem`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_redeem_access(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_redeem_merchant

- **Route**: `POST /api/v1/auth/merchant/access/redeem`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_redeem_merchant(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_request_access

- **Route**: `POST /api/v1/auth/customer/access/request`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_request_access(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.auth_api.auth_controller_request_merchant

- **Route**: `POST /api/v1/auth/merchant/access/request`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def auth_controller_request_merchant(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

