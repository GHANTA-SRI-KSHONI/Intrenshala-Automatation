const puppeteer = require('puppeteer');
const coverletterfn = require('../data/internshalaData.js');

async function fetchAuto(userData, inputURL){
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',  
        headless: false,
        defaultViewport: false,
        args: ["--no-sandbox","--disable-setuid-sandbox", "--start-maximized"]
        });
        
        const [page] = await browser.pages();
        page.setDefaultTimeout(0)
        
        await page.goto(inputURL)
        await page.waitForNetworkIdle();

        const url = page.url();
        const popupData = await page.$('#close_popup');
        if(popupData)
            {
                console.log('Popup detected')
                await popupData.click();
            }
        //Building first for internships page
        if(url.includes('https://internshala.com/internships/') || url.includes('https://internshala.com/jobs/'))
            {
                console.log(`Correct URL Detected.`)
                let modalData;
                let coverletterfield;
                let cover_letter;     
                let additionalq;   
                let submitbutton;        
                let appliedCompany;
                let appliedProfile;
                let chk=0;

                let reqItems= (await page.$$('div[class="btn btn-primary easy_apply button_easy_apply_t"]'));
                for(let i =0;i < reqItems.length; i++)
                    {                       
                    //Working Perfect
                       await reqItems[i].click();
                       await page.waitForNetworkIdle();

                        await page.waitForSelector('div[class="modal-content easy-apply"]');
                        modalData = await page.$('div[class="modal-content easy-apply"]')
                        appliedProfile =  await modalData.$eval('.profile', (element) => element.textContent.substring(13));
                        appliedCompany =  await modalData.$eval('.company', (element) => element.textContent);
                        console.log(appliedProfile, appliedCompany);

                        await modalData.waitForSelector('#continue_button')
                        await (await modalData.$('#continue_button')).click();
                        await page.waitForNetworkIdle();
                    //Working Perfect
                   
                    additionalq = await modalData.$('div[class="form-group additional_question"]');
                    if(additionalq && chk==0)
                        {
                            await (await page.$('button[id="easy_apply_modal_close"]')).click();
                            await page.waitForNetworkIdle();

                            await (await page.$('button[class="btn btn-primary btn-large button_exit"]')).click();
                            await page.waitForNetworkIdle();
                        }
                        else
                        {
                        await page.waitForSelector('div[class="modal-content easy-apply"]');
                        modalData = await page.$('div[class="modal-content easy-apply"]');

                        await (await modalData.waitForSelector('div[id="cover_letter_holder"]')).click();
                        
                        cover_letter = coverletterfn(appliedCompany);
                        coverletterfield = await modalData.$('textarea[id="cover_letter"]');
                        await page.keyboard.down('ControlLeft')
                        await page.keyboard.press('KeyA')
                        await page.keyboard.up('ControlLeft');
                        await page.keyboard.press('Backspace');
    
                        await coverletterfield.type(cover_letter);
                        await page.waitForNetworkIdle();

                        submitbutton = (await modalData.$('input[id="submit"]'));
                        if(chk==0)
                            {
                            await submitbutton.click();
                            await page.waitForNetworkIdle();
                            }

                        submitbutton = (await modalData.$('input[id="submit"]'));
                            if(submitbutton && chk==0)
                                {
                                    await (await page.$('button[id="easy_apply_modal_close"]')).click();
                                    await page.waitForNetworkIdle();

                                    await (await page.$('button[class="btn btn-primary btn-large button_exit"]')).click();
                                    await page.waitForNetworkIdle();
                                }
                            else
                            {
                                await (await page.$('a[class="back-cta"]')).click();
                                await page.waitForNetworkIdle();
                            }
                            }

                        
                        reqItems= (await page.$$('div[class="btn btn-primary easy_apply button_easy_apply_t"]'));
                        if(i==reqItems.length-1 && chk==0)
                            {
                            chk=1;
                            i=0;
                            }


                    }
                console.log('Process Completed')
            }
        else
            {
                console.log(`Oops! URL not supported.`)
                alert(`Oops! URL not supported.`);
            }
}


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }


fetchAuto({}, 'https://internshala.com/internships/node-js-development-internship/stipend-6000/')
module.exports = fetchAuto;