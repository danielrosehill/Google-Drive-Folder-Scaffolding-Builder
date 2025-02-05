function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Folder Scaffolding Generator')
      .setFaviconUrl('https://www.google.com/images/icons/product/drive-32.png')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createFolderStructure(formData) {
  try {
    // Validate input
    if (!formData.targetFolder) {
      return { success: false, message: 'Please provide a target folder URL.' };
    }
    if (!formData.years || formData.years.length === 0) {
      return { success: false, message: 'Please select at least one year.' };
    }

    // Get folder ID and verify folder exists
    const targetFolderId = extractFolderId(formData.targetFolder);
    if (!targetFolderId) {
      return { success: false, message: 'Invalid folder URL. Please provide a valid Google Drive folder URL.' };
    }

    let targetFolder;
    try {
      targetFolder = DriveApp.getFolderById(targetFolderId);
    } catch (e) {
      return { success: false, message: 'Could not access the specified folder. Please check the URL and your permissions.' };
    }

    // Setup month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const useMonthNames = formData.monthFormat === 'named';

    // Create folder structure
    let foldersCreated = 0;
    formData.years.forEach(year => {
      // Create year folder
      const yearFolder = targetFolder.createFolder(year.toString());
      
      // Create month folders
      for (let month = 1; month <= 12; month++) {
        const monthNum = month.toString().padStart(2, '0');
        const monthName = useMonthNames ? `${monthNum}_${monthNames[month-1]}` : monthNum;
        yearFolder.createFolder(monthName);
        foldersCreated++;
      }
    });

    return { 
      success: true, 
      message: `Successfully created ${foldersCreated} folders in ${formData.years.length} year(s)!`
    };

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return { 
      success: false, 
      message: 'An error occurred: ' + error.toString()
    };
  }
}

function extractFolderId(folderUrl) {
  // Handle different URL formats
  const patterns = [
    /\/folders\/([a-zA-Z0-9-_]+)/,  // Regular folder URL
    /id=([a-zA-Z0-9-_]+)/,         // URL with id parameter
    /^([a-zA-Z0-9-_]{25,})/        // Direct folder ID
  ];

  for (let pattern of patterns) {
    const match = folderUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Optional: Add a test function
function testFolderAccess(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    return {
      success: true,
      name: folder.getName(),
      message: 'Folder accessed successfully'
    };
  } catch (e) {
    return {
      success: false,
      message: 'Could not access folder: ' + e.toString()
    };
  }
}