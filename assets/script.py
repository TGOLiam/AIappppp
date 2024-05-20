import os

# Get the list of image files in the current directory
image_files = [f for f in os.listdir() if f.endswith('.png')]

# Sort the list of image files
image_files.sort()

# Rename the image files with numbers
for i, filename in enumerate(image_files, 1):
    new_filename = f"{i}.png"
    os.rename(filename, new_filename)
    print(f"Renamed {filename} to {new_filename}")
