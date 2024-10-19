const puppeteer = require('puppeteer');
const readline = require('readline');
const { email, password } = require('./config.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para obter entrada do usuário
const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const login = async (page) => {
    await page.goto('https://comunidade.onebitcode.com/users/sign_in#email');
    await page.type('#user_email', email);
    await page.type('#user_password', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
};

const markModuleAsDone = async (page, curso, modulo) => {
    await page.goto(curso, { waitUntil: 'networkidle2', timeout: 15000 });

    await page.waitForSelector('button.bg-secondary');

    const divContent = await page.evaluate((modulo) => {
        const targetSpan = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.trim() === modulo);

        if (targetSpan) {
            const buttonDiv = targetSpan.closest('button').parentElement;
            return Array.from(buttonDiv.querySelectorAll('a')).map(link => link.href);
        }

        return null;
    }, modulo);

    if (!divContent) {
        console.log('Módulo não encontrado. Tente novamente!');
        process.exit(0);
    }

    for (const link of divContent) {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    }
};

const markAllModulesAsDone = async (page, curso) => {
    await page.goto(curso, { waitUntil: 'networkidle2', timeout: 15000 });

    const lessonLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
            .map(link => link.href)
            .filter(href => href.includes('/lesson'));
    });

    for (const link of lessonLinks) {
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    }
};

(async () => {
    const option = await askQuestion('Selecione uma opção:\n1. Marcar módulo de curso como feito\n2. Marcar todos os módulos do curso como feito\n');

    let curso, modulo;

    switch (option) {
        case "1":
            curso = await askQuestion('Insira o link do curso: ');
            modulo = await askQuestion('Qual módulo você quer marcar como feito? ');
            console.log(`Você selecionou o curso: ${curso} e o módulo: ${modulo}`);
            break;
        case "2":
            curso = await askQuestion('Insira o link do curso: ');
            console.log(`Você selecionou o curso: ${curso}`);
            break;
        default:
            console.log("Opção inválida. Tente novamente.");
            rl.close();
            return;
    }

    rl.close();

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await login(page);

        if (option === "1" && curso && modulo) {
            await markModuleAsDone(page, curso, modulo);
        } else if (option === "2" && curso) {
            await markAllModulesAsDone(page, curso);
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    } finally {
        await browser.close();
    }
})();
