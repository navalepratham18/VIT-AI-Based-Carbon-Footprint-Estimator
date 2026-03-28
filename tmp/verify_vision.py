import sys
import os
from pathlib import Path

# Add the Vision Engine directory to path
vision_engine_path = Path(r"d:\Code4Society\EcoGuard Vision Engine")
sys.path.append(str(vision_engine_path))

import predictor

print("Testing Model Loader...")
try:
    p = predictor.get_predictor()
    print("✓ Models loaded successfully")
    
    # Check if a model is indeed loaded
    if p.vision_model:
        print(f"✓ Vision Model Type: {type(p.vision_model)}")
    else:
        print("✗ Vision Model NOT loaded")
        
    if p.weight_estimator:
        print(f"✓ Weight Estimator loaded")
    else:
        print("✗ Weight Estimator NOT loaded")
        
except Exception as e:
    print(f"✗ Error: {e}")
