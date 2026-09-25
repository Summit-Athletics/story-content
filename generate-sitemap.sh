#!/bin/bash

# ============================================================
# Sitemap Generator
#
# Finds .kit pages in /src and generates /dist/sitemap.xml.
#
# Requirements:
#   - CK_PROJECT_ROOT must be provided by CodeKit.
#   - SITE_URL should be configured as a CodeKit environment
#     variable.
#
# Pages containing a robots noindex directive are excluded.
# ============================================================

set -e

# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------

PROJECT_ROOT="$CK_PROJECT_ROOT"
SOURCE_DIR="$PROJECT_ROOT/src"
OUTPUT_FILE="$PROJECT_ROOT/dist/sitemap.xml"

# SITE_URL should be supplied by CodeKit.
# Example:
# SITE_URL=https://www.hokieclub.com
if [[ -z "$SITE_URL" ]]; then
    echo "Error: SITE_URL environment variable is not set."
    exit 1
fi

# Remove trailing slash from SITE_URL.
SITE_URL="${SITE_URL%/}"


# ------------------------------------------------------------
# Helper: XML escape
# ------------------------------------------------------------

xml_escape() {
    local TEXT="$1"

    TEXT="${TEXT//&/&amp;}"
    TEXT="${TEXT//</&lt;}"
    TEXT="${TEXT//>/&gt;}"
    TEXT="${TEXT//\"/&quot;}"
    TEXT="${TEXT//\'/&apos;}"

    echo "$TEXT"
}


# ------------------------------------------------------------
# Generate URL from .kit path
# ------------------------------------------------------------

get_url_path() {
    local FILE="$1"

    # Remove source directory.
    local RELATIVE="${FILE#$SOURCE_DIR/}"

    # Remove .kit extension.
    local PATH_WITHOUT_EXTENSION="${RELATIVE%.kit}"

    # Root page.
    if [[ "$PATH_WITHOUT_EXTENSION" == "index" ]]; then
        echo "/"
        return
    fi

    # Directory index page.
    if [[ "$PATH_WITHOUT_EXTENSION" == */index ]]; then
        echo "/${PATH_WITHOUT_EXTENSION%/index}/"
        return
    fi

    # Regular .kit page.
    echo "/$PATH_WITHOUT_EXTENSION/"
}


# ------------------------------------------------------------
# Determine whether a page should be indexed
# ------------------------------------------------------------

is_noindex() {
    local FILE="$1"

    # Look for a robots meta tag containing "noindex".
    #
    # Handles:
    # <meta name="robots" content="noindex">
    # <meta name="robots" content="noindex, nofollow">
    # <meta content="noindex, nofollow" name="robots">
    #
    # Case-insensitive search.

    if grep -Eiq 'name[[:space:]]*=[[:space:]]*"robots"[^>]*content[[:space:]]*=[[:space:]]*"[^"]*noindex' "$FILE"; then
        return 0
    fi

    if grep -Eiq 'content[[:space:]]*=[[:space:]]*"[^"]*noindex[^"]*"[^>]*name[[:space:]]*=[[:space:]]*"robots"' "$FILE"; then
        return 0
    fi

    return 1
}


# ------------------------------------------------------------
# Find pages
# ------------------------------------------------------------

URLS=()

while IFS= read -r FILE; do

    # Skip files containing noindex.
    if is_noindex "$FILE"; then
        echo "Skipping noindex page: ${FILE#$SOURCE_DIR/}"
        continue
    fi

    URL_PATH="$(get_url_path "$FILE")"
    FULL_URL="${SITE_URL}${URL_PATH}"

    URLS+=("$FULL_URL")

done < <(
    find "$SOURCE_DIR" \
        -type f \
        -name "*.kit" \
        ! -name "_*.kit" \
        ! -path "*/_*/*"
)


# ------------------------------------------------------------
# Sort URLs
# ------------------------------------------------------------

IFS=$'\n' URLS=($(sort <<<"${URLS[*]}"))
unset IFS


# ------------------------------------------------------------
# Create output directory
# ------------------------------------------------------------

mkdir -p "$(dirname "$OUTPUT_FILE")"


# ------------------------------------------------------------
# Generate sitemap
# ------------------------------------------------------------

# Write the sitemap to a temporary file first.
# This prevents a partially-written sitemap if the script
# is interrupted while CodeKit is processing files.

TEMP_FILE="$(mktemp)"

{
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    for URL in "${URLS[@]}"; do
        ESCAPED_URL="$(xml_escape "$URL")"

        echo "  <url>"
        echo "    <loc>${ESCAPED_URL}</loc>"
        echo "  </url>"
    done

    echo '</urlset>'

} > "$TEMP_FILE"

# Replace the existing sitemap only after the new one
# has been completely generated.
mv "$TEMP_FILE" "$OUTPUT_FILE"


# ------------------------------------------------------------
# Output summary
# ------------------------------------------------------------

echo ""
echo "Sitemap generated:"
echo "  $OUTPUT_FILE"
echo ""
echo "URLs included: ${#URLS[@]}"
echo ""