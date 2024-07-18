const date = new Date();

document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year in footer
    const copyrightYear = document.querySelector('#copyright-year');
    const year = date.getFullYear();
    copyrightYear.innerHTML = year;
});

const fileInput = document.querySelector('#fileInput');

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    Papa.parse(file, {
        complete: function(results) {
            const data = results.data.slice(1);

            const outputData = data.map(row => ({
                // Headers from the imported file. Needs to be in this order or it will be mixed up
                name: row[0],
                address: row[1],
                city: row[2],
                state: row[3],
                zip: row[4],
                model: row[5],
                hours: row[6],
                category: row[7],
            }));

            // Headers in the order Mapify expects them
            const newHeaders = [
                'Title', 'Description', 'Map Tag', 'Enable Pop-up? Y/N', 'Link location to another page? Y/N',
                'Enter URL', 'Enable Tooltip? Y/N', 'Close Tooltip Automatically/Manually', 'Include Location Information? Y/N',
                'Include Directions? Y/N', 'Tooltip Content', 'Include on Selected Map(s) Location List? Y/N',
                'Short Description (appears in Interactive List)', 'Pin Image URL', 'Video Embed code', 'Gallery Images',
                'Location Address or GPS Coordinates', 'Phone Number', 'Street Address', 'State', 'City', 'Zip', 'Country',
                'Enable Sharing? Y/N', 'Tooltip Image URL'
            ];

            // Put new headers in for csv
            const newRows = [newHeaders.join(',')];

            const escapeQuotes = str => str.replace(/"/g, '""');
            const sanitize = str => escapeQuotes((str || '').replace(/\n/g, '').trim());

            outputData.forEach(entry => {
                const fullAddress = `${entry.address}, ${entry.city}, ${entry.state} ${entry.zip}`;
                const sanitizedName = sanitize(entry.name);
                const sanitizedAddress = sanitize(fullAddress);
                const sanitizedHours = sanitize(entry.hours);
                const hasCash = entry.model === 'BK' || entry.model === 'HOKU';

                const newRow = newHeaders.map(header => {
                    let value = '';

                    switch (header) {
                        case 'Title':
                            value = sanitizedName;
                            break;
                        case 'Street Address':
                            value = entry.address;
                            break;
                        case 'State':
                            value = entry.state;
                            break;
                        case 'City':
                            value = entry.city;
                            break;
                        case 'Zip':
                            value = entry.zip;
                            break;
                        case 'Map Tag':
                            value = `${hasCash ? 'cash' : ''}`;
                            break;
                        case 'Enable Pop-up? Y/N':
                        case 'Enable Tooltip? Y/N':
                        case 'Include Location Information? Y/N':
                        case 'Include Directions? Y/N':
                        case 'Include on Selected Map(s) Location List? Y/N':
                            value = 'Y';
                            break;
                        case 'Close Tooltip Automatically/Manually':
                            value = 'Automatically';
                            break;
                        case 'Description':
                            value = `[itimpfy_location_main name="${sanitizedName}" address="${sanitizedAddress}" ${hasCash ? 'cash="true"' : ''} hours="${sanitizedHours}"]`;
                            break;
                        case 'Tooltip Content':
                            value = `[itimpfy_location_tooltip address="${sanitizedAddress}" ${hasCash ? 'cash="true"' : ''}]`;
                            break;
                        case 'Short Description (appears in Interactive List)':
                            value = `[itimpfy_location_short_description address="${sanitizedAddress}" hours="${sanitizedHours}"]`;
                            break;
                        default:
                            value = entry[header] || '';
                    }

                    return `"${sanitize(value)}"`;
                }).join(',');

                newRows.push(newRow);
            });

            const newCsvString = newRows.join('\n');
            const blob = new Blob([newCsvString], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `itimpfy-import_${date.getTime()}.csv`;
            document.body.appendChild(a); // Append to body
            a.click();
            document.body.removeChild(a); // Remove from body
            URL.revokeObjectURL(url);
        },

        error: function(err) {
            console.error(err);
        }
    });
});
