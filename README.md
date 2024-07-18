# mapify-bulk-upload-generator
A template generator that takes a csv and returns a new formatted csv

## The problem
Needing to generate shortcodes dynamically to populate in mapify post descriptions

## The solution
Format a csv file and upload it into this application to generate a new csv that Mapify expects for its bulk upload, 
with dynamic data.

## Instructions

1. Open new spreadsheet
2. Copy and paste the following fows (including headers) from the Master SST Info sheet (must be in this specific order):

Example:

| Name | Address | City | State | Zip | Model | Hours  | County |
|------|---------|------|-------|-----|-------|--------|--------|
| ITI  | 123 Rd. | FTW  |  IN   |46845|  BK   |M-S:24/7| Allen  |

3. Paste the new rows in, making sure they're in the correct order
4. Format the hours for the shortcode (values separated by semicolon will drop to a new line in the browser)
   
   *Example: Mon-Fri: 6:00 AM - 11:00 PM; Saturday: 8:00 AM - 6:00 PM; Sunday: Closed*

5. Save and upload the file into the HTML document in the browser
6. Upload the file into Mapify's bulk upload

    *MapifyPro -> Batch Upload -> Choose File -> Import*

7. All of the locations should start to list if they were imported successfully or not

    *Make a note of any that are unsuccessful, because they will need manually geocoded. Or there is something wrong with the address*