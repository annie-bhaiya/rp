# Raw Reference

**Raw** endpoints, reached through `with_raw_response`, return `ApiResult[T, E]` and never raise for an API error. For the parsed endpoints, see [API Reference](api-reference.md).

> Source: [ResolvePayRescueApiClient](resolve_pay_rescue_api/client.py)

## AuthApi

> Source: [AuthApi](resolve_pay_rescue_api/apis/auth_api.py)

<details>
<summary><code>def auth_controller_config(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves current authentication capability flags, including whether 1-click demo persona switching is enabled.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_config()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_config()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_get_session(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_get_session()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_get_session()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_login_dev(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_login_dev()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_login_dev()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_logout(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Revokes the active session token server-side and clears the resolvepay_session cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_logout()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_logout()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_redeem_access(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_redeem_access()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_redeem_access()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_redeem_merchant(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant session.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_redeem_merchant()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_redeem_merchant()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_request_access(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Generates and delivers a single-use access link for a customer based on normalized order reference and customer email.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_request_access()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_request_access()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def auth_controller_request_merchant(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Sends a magic sign-in link to a registered merchant user email for store workspace access.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.auth_api.with_raw_response.auth_controller_request_merchant()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.auth_api.with_raw_response.auth_controller_request_merchant()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Cases

> Source: [Cases](resolve_pay_rescue_api/apis/cases.py)

<details>
<summary><code>def cases_controller_add_message(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Appends a verified customer or merchant message to the dispute case timeline.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_add_message("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_add_message("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_complete_evidence_upload(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Marks evidence upload as completed and triggers policy validation checks.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_complete_evidence_upload(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_complete_evidence_upload(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>evidence_id</code> | <code>str</code> | Evidence item UUID identifier |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_create_case(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_create_case()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_create_case()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_create_evidence_intent(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Initializes an evidence upload slot and returns target upload metadata and hash requirements.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_create_evidence_intent("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_create_evidence_intent(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_get_case(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves complete dispute case details, state machine status, and order metadata.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_get_case("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_get_case("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_get_completeness(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating targeted clarification questions.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_get_completeness("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_get_completeness(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_get_evidence_file(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Downloads raw evidence file bytes for authorized merchant inspection.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_get_evidence_file(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_get_evidence_file(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>evidence_id</code> | <code>str</code> | Evidence item UUID identifier |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_get_timeline(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_get_timeline("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_get_timeline(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_list_cases(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_list_cases()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_list_cases()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_save_completeness_answers(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating remedy proposals.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_save_completeness_answers(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_save_completeness_answers(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def cases_controller_upload_evidence_file(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.cases.with_raw_response.cases_controller_upload_evidence_file(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.cases.with_raw_response.cases_controller_upload_evidence_file(
    "70000000-0000-0000-0000-000000000001", "90000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>evidence_id</code> | <code>str</code> | Evidence item UUID identifier |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Catalog

> Source: [Catalog](resolve_pay_rescue_api/apis/catalog.py)

<details>
<summary><code>def catalog_controller_capture_checkout_order(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.catalog_controller_capture_checkout_order(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.catalog.with_raw_response.catalog_controller_capture_checkout_order(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def catalog_controller_create_checkout_order(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.catalog_controller_create_checkout_order()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.catalog.with_raw_response.catalog_controller_create_checkout_order()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def catalog_controller_get_catalog(tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves active products, product variants, pricing, and available inventory for a merchant store.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.catalog_controller_get_catalog("default-merchant")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.catalog.with_raw_response.catalog_controller_get_catalog("default-merchant")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>tenant_slug</code> | <code>str</code> | Unique merchant store identifier slug |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def catalog_controller_get_order(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves detailed order information including line items, capture IDs, and financial totals for an authorized order.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.catalog_controller_get_order("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.catalog.with_raw_response.catalog_controller_get_order(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Dev

> Source: [Dev](resolve_pay_rescue_api/apis/dev.py)

<details>
<summary><code>def dev_controller_get_failure_injection(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns currently active failure injection simulation mode and trigger count.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.dev.with_raw_response.dev_controller_get_failure_injection()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.dev.with_raw_response.dev_controller_get_failure_injection()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def dev_controller_get_health(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns service operational status, database connectivity, and tenant count.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.dev.with_raw_response.dev_controller_get_health()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.dev.with_raw_response.dev_controller_get_health()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def dev_controller_get_mailbox(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Inspects synthetic outbound transactional emails and customer access links captured locally.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.dev.with_raw_response.dev_controller_get_mailbox()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.dev.with_raw_response.dev_controller_get_mailbox()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def dev_controller_re_seed(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Populates database with synthetic products, policies, and demo orders.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.dev.with_raw_response.dev_controller_re_seed()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.dev.with_raw_response.dev_controller_re_seed()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def dev_controller_set_failure_injection(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Sets chaos simulation mode (PROVIDER_DROP_BEFORE_RESPONSE, PROVIDER_500, LEDGER_IMBALANCE) to test resilience.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.dev.with_raw_response.dev_controller_set_failure_injection()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.dev.with_raw_response.dev_controller_set_failure_injection()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Merchant

> Source: [Merchant](resolve_pay_rescue_api/apis/merchant.py)

<details>
<summary><code>def merchant_controller_export_reconciliation_csv(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.merchant.with_raw_response.merchant_controller_export_reconciliation_csv()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.merchant.with_raw_response.merchant_controller_export_reconciliation_csv()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def merchant_controller_get_insights(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Aggregates return rates, common defect categories, and resolution cost analytics.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.merchant.with_raw_response.merchant_controller_get_insights()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.merchant.with_raw_response.merchant_controller_get_insights()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Plans

> Source: [Plans](resolve_pay_rescue_api/apis/plans.py)

<details>
<summary><code>def plans_controller_accept_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_accept_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_accept_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_approve_and_execute(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_approve_and_execute("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_approve_and_execute(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_approve_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_approve_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_approve_plan(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_execute_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_execute_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_execute_plan(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_generate_proposals(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement, Exchange).

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_generate_proposals("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_generate_proposals(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_get_plans(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists all proposed remedy plans with exact monetary calculations and return requirements.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_get_plans("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_get_plans("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def plans_controller_reject_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Rejects a proposed remedy plan and returns the case to manual review.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.plans.with_raw_response.plans_controller_reject_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.plans.with_raw_response.plans_controller_reject_plan("70000000-0000-0000-0000-000000000001")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Policies

> Source: [Policies](resolve_pay_rescue_api/apis/policies.py)

<details>
<summary><code>def policies_controller_get_policies(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves active return, replacement, and exchange policy versions and structured rules.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.policies.with_raw_response.policies_controller_get_policies()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.policies.with_raw_response.policies_controller_get_policies()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def policies_controller_publish_policy(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Publishes a new immutable policy version with SHA-256 integrity hash.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.policies.with_raw_response.policies_controller_publish_policy()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.policies.with_raw_response.policies_controller_publish_policy()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Resolutions

> Source: [Resolutions](resolve_pay_rescue_api/apis/resolutions.py)

<details>
<summary><code>def resolutions_controller_get_receipt(case_id: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and double-entry ledger citations.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.resolutions.with_raw_response.resolutions_controller_get_receipt("4c52b868-9844-41a3-b3d0-8de4f230fc06")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.resolutions.with_raw_response.resolutions_controller_get_receipt(
    "4c52b868-9844-41a3-b3d0-8de4f230fc06"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>case_id</code> | <code>str</code> | Dispute case UUID identifier |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def resolutions_controller_get_recovery_queue(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.resolutions.with_raw_response.resolutions_controller_get_recovery_queue()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.resolutions.with_raw_response.resolutions_controller_get_recovery_queue()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def resolutions_controller_reconcile_operation(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.resolutions.with_raw_response.resolutions_controller_reconcile_operation(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.resolutions.with_raw_response.resolutions_controller_reconcile_operation(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def resolutions_controller_record_inspection(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund disbursement.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.resolutions.with_raw_response.resolutions_controller_record_inspection(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.resolutions.with_raw_response.resolutions_controller_record_inspection(
    "70000000-0000-0000-0000-000000000001"
)
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Unique UUID identifier of the target resource |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Webhooks

> Source: [Webhooks](resolve_pay_rescue_api/apis/webhooks.py)

<details>
<summary><code>def webhooks_controller_handle_email_connection_webhook(connection_key: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound email webhooks for a specific store connection key.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.webhooks.with_raw_response.webhooks_controller_handle_email_connection_webhook("default")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.webhooks.with_raw_response.webhooks_controller_handle_email_connection_webhook("default")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>connection_key</code> | <code>str</code> | Webhook store connection identifier key |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def webhooks_controller_handle_email_webhook(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.webhooks.with_raw_response.webhooks_controller_handle_email_webhook()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.webhooks.with_raw_response.webhooks_controller_handle_email_webhook()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def webhooks_controller_handle_pay_pal_connection_webhook(connection_key: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound PayPal webhook events directed to a specific merchant connection key.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.webhooks.with_raw_response.webhooks_controller_handle_pay_pal_connection_webhook("default")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.webhooks.with_raw_response.webhooks_controller_handle_pay_pal_connection_webhook("default")
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>connection_key</code> | <code>str</code> | Webhook store connection identifier key |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def webhooks_controller_handle_pay_pal_webhook(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, RawError]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound PayPal payment capture, authorization, and refund events.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.webhooks.with_raw_response.webhooks_controller_handle_pay_pal_webhook()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.webhooks.with_raw_response.webhooks_controller_handle_pay_pal_webhook()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](resolve_pay_rescue_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](resolve_pay_rescue_api/core/results.py)&#91;None, [RawError](resolve_pay_rescue_api/core/results.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[RawError](resolve_pay_rescue_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

