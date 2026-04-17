const fs = require('fs');
let css = fs.readFileSync('./assets/styles/home.css', 'utf8');

// Add fonts to top
css = css.replace(':root {', `body {\n    font-family: 'Poppins', sans-serif;\n}\n\nh1, h2, h3, h4, h5, h6 {\n    font-family: 'Hiruko', sans-serif;\n}\n\n:root {\n    --red: #f04e4e;`);

// Replace Nuppnito with Poppins
css = css.replace(/font-family: 'Nuppnito', sans-serif;/g, `font-family: 'Poppins', sans-serif;`);

// Replace Fredoka with Hiruko
css = css.replace(/font-family: 'Fredoka', sans-serif;/g, `font-family: 'Hiruko', sans-serif;`);

// Add the grade-selection classes
const newClasses = `
    .grade-selection {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 40px;
        position: relative;
        z-index: 2;
    }

    .btn-grade {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        border: none;
        font-family: 'Hiruko', sans-serif;
        font-size: 32px;
        font-weight: bold;
        color: var(--text-dark);
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .btn-grade:hover {
        transform: scale(1.05);
    }
    
    .bg-red {
        background-color: var(--red);
    }
`;

css = css.replace('.landscape {', newClasses + '\n    .landscape {');

fs.writeFileSync('./assets/styles/home.css', css);
console.log('CSS updated');
