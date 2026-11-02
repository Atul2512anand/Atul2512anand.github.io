from PIL import Image, ImageFilter
from collections import deque

src = Image.open(r'public/profile image.png').convert('RGBA')
w, h = src.size
px = src.load()

def is_bg(c):
    r, g, b = c[:3]
    return r > 150 and g > 130 and (r - b) > 48 and (g - b) > 38

visited = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h-1):
        if is_bg(px[x, y]) and not visited[y*w+x]:
            visited[y*w+x] = 1; q.append((x, y))
for y in range(h):
    for x in (0, w-1):
        if is_bg(px[x, y]) and not visited[y*w+x]:
            visited[y*w+x] = 1; q.append((x, y))

while q:
    x, y = q.popleft()
    px[x, y] = (*px[x, y][:3], 0)
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < w and 0 <= ny < h:
            i = ny*w+nx
            if not visited[i] and is_bg(px[nx, ny]):
                visited[i] = 1; q.append((nx, ny))

alpha = src.getchannel('A').filter(ImageFilter.GaussianBlur(0.5))
src.putalpha(alpha)
bbox = src.getbbox()
print('bbox', bbox)
cropped = src.crop(bbox)
cropped.save(r'public/atul-cutout.png')
print('cutout', cropped.size)
