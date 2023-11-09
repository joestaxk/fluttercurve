import queueEmail from "../models/services/queueEmail";

interface Paragraph {
    type: 'p';
    msg: string;
}
  
  interface Link {
    type: 'a';
    link: string;
    value: any;
  }
  
  type TemplateItem = Paragraph | Link;
  
  export function reusableParagraph(message?: string): string {
    if (typeof message === 'undefined') return '';
    return `
      <p style="font-weight: 400; font-size: 1rem; color: #212121ccc; margin-top: 2rem">${message}</p>
    `;
  }
  
  function reusableLink(link: string, value: any): string {
    if (typeof link !== 'string') return '';
    return `
      <a href="https://commerce.coinbase.com/charges/${link}">
        <button style="display: flex; align-items: center; gap: 1; margin-top: 2rem; background: #514AB1; border-radius: 1rem; color: #fff; padding: .8rem">
          <span>${value}</span>
        </button>
      </a>
    `;
  }
  
  function reusableContainer(arr: TemplateItem[]): string {
    let html = '';
  
    for (let i = 0; i < arr.length; ++i) {
      const item = arr[i];
      if (item.type === 'p') {
        html += reusableParagraph(item.msg);
      } else if (item.type === 'a') {
        html += reusableLink(item.link, item.value);
      }
    }
  
    return html;
  }
  
// SET TEMPLATES
  const templates = {
    initQueueing: async function (id:string, header:string, recipient:string, username: string,  message: string, priority?:string) {
        try {
            await queueEmail.create({
                clientId: id,
                header,
                recipient,
                username,
                message,
                priority: priority || "HIGH"
            })
        } catch (error) {
            console.log(error)
        }
    },
    // sendMail: async function(){

    // },

    successfulChargeMailTemplate: async (userId:string, arr: TemplateItem[], email: string, userName: string) => {
      const containerHtml = reusableContainer(arr); // create the template

      await templates.initQueueing(userId, "Congratulations, You've Successfully started a new investment", email, userName,  containerHtml)
      return containerHtml;
    },

    createSimpleMailTemp:async (arr: TemplateItem[], email: string, userName: string, header:string, userId:string) => {
      const containerHtml = reusableContainer(arr); // create the template

      await templates.initQueueing(userId, header, email, userName,  containerHtml)
      return containerHtml;
    }
  };
  
 
export default templates;