function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Folder Scaffolding Generator')
      .setFaviconUrl('https://www.google.com/images/icons/product/drive-32.png');
}

function createFolderStructure(formData) {
  try {
    const targetFolderId = extractFolderId(formData.targetFolder);
    const targetFolder = DriveApp.getFolderById(targetFolderId);
    const useMonthNames = formData.monthFormat === 'named';
    const selectedYears = formData.years;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    selectedYears.forEach(year => {
      const yearFolder = targetFolder.createFolder(year);
      
      for (let month = 1; month <= 12; month++) {
        const monthNum = month.toString().padStart(2, '0');
        const monthName = useMonthNames ? `${monthNum}_${monthNames[month-1]}` : monthNum;
        yearFolder.createFolder(monthName);
      }
    });
    
    return { success: true, message: 'Folders created successfully!' };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function extractFolderId(folderUrl) {
  const match = folderUrl.match(/[-\w]{25,}/);
  return match ? match[0] : '';
}