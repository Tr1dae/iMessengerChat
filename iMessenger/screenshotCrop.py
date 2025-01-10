import pygetwindow as gw
import pyautogui
import time
import sys

def capture_window_screenshot(window_title, output_file='screenshot.png', aspect_ratio=(9, 17.5)):
    """
    Capture a screenshot of a specific window by its title, cropping to a specified aspect ratio centered in the window.

    :param window_title: Title of the window to capture.
    :param output_file: Name of the output screenshot file.
    :param aspect_ratio: Tuple representing the desired aspect ratio (width, height).
    """
    try:
        # Print all available window titles for debugging
        # print("Available window titles:")
        # for win in gw.getAllWindows():
        #     if win.title:  # Only print windows with a title
        #         print(f" - {win.title}")

        # Find the window by its title
        window = gw.getWindowsWithTitle(window_title)[0]

        if window:
            # Activate the window
            window.activate()
            time.sleep(1)  # Wait for the window to focus

            # Get the window's position and size
            left, top, width, height = window.left, window.top, window.width, window.height

            # Calculate the target width and height based on the aspect ratio
            target_width, target_height = aspect_ratio
            window_aspect_ratio = width / height

            if window_aspect_ratio > (target_width / target_height):
                # Window is wider than the target aspect ratio
                new_height = height
                new_width = int(new_height * (target_width / target_height))
            else:
                # Window is taller than the target aspect ratio
                new_width = width
                new_height = int(new_width * (target_height / target_width))

            # Calculate the cropping region to center the aspect ratio
            crop_x1 = left + (width - new_width) // 2
            crop_y1 = top + (height - new_height) // 2
            crop_x2 = crop_x1 + new_width
            crop_y2 = crop_y1 + new_height

            # Capture the screenshot of the cropped region
            screenshot = pyautogui.screenshot(region=(crop_x1, crop_y1, new_width, new_height))

            # Save the screenshot
            screenshot.save(output_file)
            print(f"Screenshot saved to {output_file}")

        else:
            print(f"Window with title '{window_title}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python screenshotCrop.py <window_title> <output_file> <aspect_ratio>")
        sys.exit(1)

    window_title = sys.argv[1]
    output_file = sys.argv[2]
    aspect_ratio = tuple(map(float, sys.argv[3].split(',')))

    capture_window_screenshot(window_title, output_file, aspect_ratio)