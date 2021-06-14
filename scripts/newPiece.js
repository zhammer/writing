import { writeFileSync } from "fs";
import { argv } from "process";

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

let title = argv[2];
let slug = slugify(title);
let today = new Date().toISOString().split('T')[0];

let piece = `\`\`\`piece
title: ${title}
slug: ${slug}
date: ${today}
description: ""

# meta:
#   song:
#     name: 
#     artist:
#     url:
\`\`\`
`;


writeFileSync(`${slug}.txt`, piece);