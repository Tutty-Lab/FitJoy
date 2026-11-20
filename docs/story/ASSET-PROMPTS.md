# Prompt pack cho bước sản xuất hình

Chưa chạy tạo ảnh: công cụ built-in `image_gen` không có trong phiên. CLI fallback chỉ chạy khi người dùng chọn, có `OPENAI_API_KEY`. Các prompt dưới đây là brief; không phải bằng chứng đã tạo asset.

## Vestibu · six pose edits

Use-case: stylized-concept. Edit target/reference: original `src/assets/home/vestibu-welcome.png`. Preserve the exact character identity, inner-ear silhouette, three semicircular canals, face proportions, clothing and colors. Full body, centered, transparent background, no text, no extra limbs, no redesign. One pose per output.

1. Greeting: warm smile, gentle open-handed wave, relaxed stance.
2. Happy: pleased smile, hands relaxed, small buoyant pose.
3. Thinking: curious expression, hand near chin, gentle head tilt.
4. Encouraging: reassuring smile, one thumbs-up, friendly eye contact.
5. Resting: seated comfortably on a small simple bench, calm expression; no sadness or guilt.
6. Celebrating: small joyful jump, arms lifted, full character uncropped.

Suggested review paths: `src/assets/story/vestibu-greeting-v1.png`, `vestibu-happy-v1.png`, `vestibu-thinking-v1.png`, `vestibu-encouraging-v1.png`, `vestibu-resting-v1.png`, `vestibu-celebrating-v1.png`. Create new files; never overwrite original.

## Environment illustrations

Use-case: stylized-concept. Friendly illustrated island for a balance-training game. Soft petrol teal, mint vegetation, warm sand, pale blue water, coral details. Rounded shapes, clean readable mobile composition, no text, no characters, no logos. Wide 2:1 composition. Keep identical viewpoint and object placement between misty and restored variants. Do not imply that exercise cures illness.

- Harbor: small wooden jetty, tiny boat, lamp post, shore bench, flagpole; misty version subdued, restored version warm lamp and vegetation.
- Forest: gentle winding trail, broad rounded trees, small wooden footbridge; misty version subdued, restored version green foliage and small flowers.
- Lighthouse: low coastal hill, red-and-cream lighthouse, safe curved path; misty version unlit, restored version soft golden beam.

Suggested paths: `src/assets/story/{harbor,forest,lighthouse}-{misty,restored}-v1.png`. Six distinct built-in image calls when available. Inspect before integration; maintain visual continuity.
