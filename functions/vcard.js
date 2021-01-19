const vCardsJS = require('vcards-js');
const imageToBase64 = require('image-to-base64');


exports.handler = async function(event, context) {
  
  const params = event.queryStringParameters
    //create a new vCard
    const vCard = vCardsJS();
     
    //set basic properties shown before
    vCard.firstName = params.firstName ? params.firstName : '';
    vCard.middleName = params.middleName ? params.middleName : '';
    vCard.lastName = params.lastName ? params.lastName : '';
    vCard.title = params.position ? params.position : '';
    vCard.uid = '69531f4a-c34d-4a1e-8922-bd38a9476a53';
    vCard.organization = params.company ? params.company : '';
    
    vCard.workPhone = params.phone ? params.phone : '';
    vCard.workUrl = params.permalink ? params.permalink : '';
    vCard.note = 'Notes on Eric';
     
    //set other vitals
    
    //set other phone numbers
    vCard.cellPhone = params.mobile ? params.mobile : '';
     
    //set fax/facsimile numbers
    // vCard.workFax = '312-555-1717';
     
    //set email addresses
    vCard.workEmail = params.email ? params.email : '';
     
    //set logo of organization or personal logo (also supports embedding, see above)
    // vCard.logo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');
           
    // vCard.workAddress.label = 'Work Address';
    const address2 = params.address2 ? `\n${params.address2}` : ''
    vCard.workAddress.street = `${params.address1}${address2}`;
    vCard.workAddress.city = params.city;
    vCard.workAddress.stateProvince = params.state;
    vCard.workAddress.postalCode = params.zip;
    vCard.workAddress.countryRegion = params.country;
     
    //set social media URLs
    vCard.socialUrls['facebook'] = params.facebook ? params.facebook : null;
    vCard.socialUrls['linkedIn'] = params.linkedin ? params.linkedin : null;
    vCard.socialUrls['twitter'] = params.twitter ? params.twitter : null;
     
    //you can also embed photos from files instead of attaching via URL
    if(params.image){
      const photo = await getImage(params.image);
      vCard.photo.embedFromString(photo)
    }
     
    vCard.version = '4.0'; //can also support 2.1 and 4.0, certain versions only support certain fields
     
    //get as formatted string
    const fileName = `${params.firstName}-${params.lastName}.vcf`
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": `text/vcard;charset=utf-8;name="${fileName}"`,
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
      body: vCard.getFormattedString(),
      isBase64Encoded: false
    }
}


async function getImage(imageURL){
  return await imageToBase64(imageURL) // Image URL
    .then(
        (response) => {
            return response;
        }
    )
    .catch(
        (error) => {
            console.log(error);
        }
    )
}