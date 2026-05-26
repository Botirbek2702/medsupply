const fs = require('fs');

try {
  fs.mkdirSync('public/images', { recursive: true });
  fs.copyFileSync('C:\\Users\\MYPRO\\.gemini\\antigravity\\brain\\05f88d72-d847-42f0-86ff-5f8e12a5e87d\\mri_machine_1779796015053.png', 'public/images/mri_machine.png');
  fs.copyFileSync('C:\\Users\\MYPRO\\.gemini\\antigravity\\brain\\05f88d72-d847-42f0-86ff-5f8e12a5e87d\\hospital_bed_1779796068522.png', 'public/images/hospital_bed.png');
  fs.copyFileSync('C:\\Users\\MYPRO\\.gemini\\antigravity\\brain\\05f88d72-d847-42f0-86ff-5f8e12a5e87d\\surgical_tools_1779796079137.png', 'public/images/surgical_tools.png');
  console.log("Images copied successfully!");
} catch (e) {
  console.error(e);
}
