$brain = 'C:\Users\purni\.gemini\antigravity-ide\brain\ca39f6ff-1a0a-4b62-8783-f890aa7085b9\.system_generated\steps'
$categories = @{
    'security-devices' = @("$brain\352\content.md", "$brain\371\content.md", "$brain\383\content.md")
    'parking-safety' = @("$brain\357\content.md")
    'human-safety' = @("$brain\358\content.md")
}

$productCategoryMap = @{}

# Process category pages to map product names to categories
foreach ($cat in $categories.Keys) {
    foreach ($file in $categories[$cat]) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            $titles = [regex]::Matches($content, 'class="woocommerce-loop-product__title">([^<]+)<') | ForEach-Object { $_.Groups[1].Value.Trim() }
            foreach ($title in $titles) {
                $productCategoryMap[$title] = $cat
            }
        }
    }
}

# Process all shop pages to get all products with images
$shopPages = @("$brain\351\content.md", "$brain\363\content.md", "$brain\370\content.md", "$brain\382\content.md", "$brain\389\content.md", "$brain\395\content.md")

$allProducts = @()
$id = 1

foreach ($file in $shopPages) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $titles = [regex]::Matches($content, 'class="woocommerce-loop-product__title">([^<]+)<') | ForEach-Object { $_.Groups[1].Value.Trim() }
        $imgs = [regex]::Matches($content, 'src="(https://gosafeglobal\.com/wp-content/uploads/\d{4}/\d{2}/[^"]+?-300x300\.(jpg|png))"') | ForEach-Object { $_.Groups[1].Value }
        
        for ($i = 0; $i -lt $titles.Count; $i++) {
            $title = $titles[$i]
            $img = if ($i -lt $imgs.Count) { $imgs[$i] } else { "images/placeholder.jpg" }
            
            # Special case for Electric Fencing since it wasn't on the category page (406 error)
            $cat = "security-devices"
            if ($productCategoryMap.ContainsKey($title)) {
                $cat = $productCategoryMap[$title]
            } elseif ($title -match "Electric Fencing") {
                $cat = "electric-fence"
            }
            
            # Build JSON object
            $escapedTitle = $title.Replace('"', '\"')
            $allProducts += "  { id: $id, name: "$escapedTitle", category: "$cat", image: "$img", price: "Enquire Now", badge: "" }"
            $id++
        }
    }
}

$jsContent = "// Product Data compiled from live site
window.GOSAFE_PRODUCTS = [
" + ($allProducts -join ",
") + "
];"

[System.IO.File]::WriteAllText("d:\GOSAFEGLOBAL\js\products-data.js", $jsContent, [System.Text.Encoding]::UTF8)
Write-Host "Generated products-data.js with 0 products!"