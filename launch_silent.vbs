Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
' Get the directory where this script resides
strPath = fso.GetParentFolderName(WScript.ScriptFullName)
' Set the working directory to that folder
WshShell.CurrentDirectory = strPath
' Run the batch file completely hidden (0)
' The batch file then runs the PowerShell script which manages the server/browser lifecycle
WshShell.Run "launch_app.bat", 0, False
