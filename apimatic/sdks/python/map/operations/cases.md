<!-- Generated file — do not edit; regenerated with the SDK. -->

# Cases — operations

Accessor: `client.cases` · Source: `resolve_pay_rescue_api/apis/cases.py` · 11 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.cases.cases_controller_add_message

- **Route**: `POST /api/v1/cases/{id}/messages`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_add_message(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_complete_evidence_upload

- **Route**: `POST /api/v1/cases/{id}/evidence/{evidenceId}/complete`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_complete_evidence_upload(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `evidence_id`
- **Params**: `id_` — path `id` · `evidence_id` — path `evidenceId`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_create_case

- **Route**: `POST /api/v1/cases`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_create_case(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_create_evidence_intent

- **Route**: `POST /api/v1/cases/{id}/evidence/upload-intent`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_create_evidence_intent(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_get_case

- **Route**: `GET /api/v1/cases/{id}`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_get_case(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_get_completeness

- **Route**: `GET /api/v1/cases/{id}/completeness`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_get_completeness(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_get_evidence_file

- **Route**: `GET /api/v1/cases/{id}/evidence/{evidenceId}/file`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_get_evidence_file(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `evidence_id`
- **Params**: `id_` — path `id` · `evidence_id` — path `evidenceId`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_get_timeline

- **Route**: `GET /api/v1/cases/{id}/timeline`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_get_timeline(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_list_cases

- **Route**: `GET /api/v1/cases`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_list_cases(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_save_completeness_answers

- **Route**: `POST /api/v1/cases/{id}/completeness/answers`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_save_completeness_answers(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.cases.cases_controller_upload_evidence_file

- **Route**: `POST /api/v1/cases/{id}/evidence/{evidenceId}/upload`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def cases_controller_upload_evidence_file(id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `evidence_id`
- **Params**: `id_` — path `id` · `evidence_id` — path `evidenceId`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

