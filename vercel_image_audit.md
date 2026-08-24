# Vercel image audit — 2026-08-24

Public URL audited: https://online-click-collect.vercel.app/

The deployed HTML references internal `/manus-storage/...` paths for the logo, hero, decorative illustration, product images, supporting images, and template previews. The public page visually showed broken image icons and alt text for these paths. The production page content and routes otherwise loaded.

Production-safe replacements were uploaded to Manus CDN and checked with HTTP requests. All 12 replacement CDN URLs returned HTTP 200:

- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/HNQkrrBgCofwNJAF.png
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/ciyYfUTXATlEKsow.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/yDDyfGzmRkLHLGqp.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/eNpEabmfOdEnGTeq.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/eEPuschtzmcFwIin.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/AftGDRZRuMFQWuUQ.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/AfirCwLfVymcpEwt.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/RyETWvrwonSCGcoV.jpg
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/EIhtuonxoqatBGXP.png
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/XTzpzDcejiJNkTuv.png
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/OfIvIIBlsKvbKiQZ.png
- https://files.manuscdn.com/user_upload_by_module/session_file/310519663898260788/AGfGvVTfiIYeKSvS.png
