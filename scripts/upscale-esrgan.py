#!/usr/bin/env python3
"""Upscale del video del hero con Real-ESRGAN (x4) en GPU (CUDA).

Mejora con IA el video EXACTO del estudio (720p) agregando detalle real.
Uso: python3 scripts/upscale-esrgan.py <frames_in_dir> <frames_out_dir>
"""
import os
import sys
import glob
import time
import torch
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet
import cv2

IN_DIR = sys.argv[1]
OUT_DIR = sys.argv[2]
WEIGHTS = os.path.expanduser("~/upscale/weights/RealESRGAN_x4plus.pth")
os.makedirs(OUT_DIR, exist_ok=True)

assert torch.cuda.is_available(), "CUDA no disponible"
print("GPU:", torch.cuda.get_device_name(0))

model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
upsampler = RealESRGANer(
    scale=4,
    model_path=WEIGHTS,
    model=model,
    tile=256,        # tiles chicos = menos pico de VRAM (más estable en WSL)
    tile_pad=10,
    pre_pad=0,
    half=True,       # fp16 en GPU = más rápido
    gpu_id=0,
)

def procesar(f, intento=0):
    out_path = os.path.join(OUT_DIR, os.path.basename(f))
    if os.path.exists(out_path):
        return True  # reanudar: ya estaba hecho
    try:
        img = cv2.imread(f, cv2.IMREAD_COLOR)
        # outscale=2: corre el modelo x4 y baja a x2 (720p -> 1440p), supersampling.
        out, _ = upsampler.enhance(img, outscale=2)
        cv2.imwrite(out_path, out)
        torch.cuda.empty_cache()
        return True
    except RuntimeError as e:
        torch.cuda.empty_cache()
        if intento < 2:
            time.sleep(2)
            return procesar(f, intento + 1)
        print(f"  FALLO {os.path.basename(f)}: {e}")
        return False

frames = sorted(glob.glob(os.path.join(IN_DIR, "*.png")))
ya = len([f for f in frames if os.path.exists(os.path.join(OUT_DIR, os.path.basename(f)))])
print(f"{len(frames)} frames ({ya} ya hechos, reanudando)")
t0 = time.time()
for i, f in enumerate(frames):
    procesar(f)
    if i % 24 == 0:
        dt = time.time() - t0
        print(f"  {i+1}/{len(frames)}  ({dt:.0f}s)")
hechos = len(glob.glob(os.path.join(OUT_DIR, "*.png")))
print(f"Listo en {time.time()-t0:.0f}s -> {hechos}/{len(frames)} frames en {OUT_DIR}")
