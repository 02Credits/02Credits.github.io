pando todo.pando; cp todo.pando ./Site/content/projects/ta/todo.pando -Force; ((Get-Content -path ./Site/content/projects/ta/todo.pando -Raw) -replace '>' 'x') | Set-Content -Path ./Site/content/projects/ta/todo.pando; pando ./Site/content/projects/ta/todo.pando