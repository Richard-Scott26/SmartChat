import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../Models/Message.model';
import { OpenAiService } from '../Services/open-ai.service';
import { IonContent } from '@ionic/angular';
import { CustomValidators } from '../Utils/custom-validators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: false}) content!: IonContent

  messages: Message[] = [
    // {
    //   sender: 'me',
    //   content: 'Hola como estas?'
    // },
    // {
    //   sender: 'bot',
    //   content: 'Bien y tu como estas?'
    // }                                    SE BORRAN PORQUE AL RECIBIR RESPUESTAS DE CHATGPT NO NECESITAMOS MENSAJES PREDETERMINADOS
  ];

  form = new FormGroup ({
    prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
  })

  loading: boolean = false;

  constructor(private openAi: OpenAiService) {}

  submit(){
    console.log(this.form.value); // AL RATO SE BORRA

    if(this.form.valid){

      let promt = this.form.value.prompt as string;

    // == mensaje del usuario ===
    let userMsg: Message = {
      sender: 'me',
      content: promt
    }
    this.messages.push(userMsg);

    // == mensaje del usuario ===
    let botMsg: Message = {
      sender: 'bot',
      content: ''
    }
    this.messages.push(botMsg);

    this.scrollToBottom();
    this.form.reset();
    this.form.disable();

    this.loading = true;

    this.openAi.sendQuestion(promt).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.typeText(res.bot);
        this.form.enable(); // ESTO SE HACE PORQUE AL BORRAR EL METODO SETTIMEOUT NO SE ACTIVA EL TEXTAREA
        
      }, error: (error: any) => {
        console.log(error)
      }
    })

    // setTimeout(() => {
    //   this.loading = false;
    //   this.typeText('estoy bien y tu?')

    //   this.form.enable();
    // }, 2000)                           SE QUITA PORQUE AL RECIBIR LA RESPUESTA DE CHATGPT POS NO SE NECESITA

    }
    
  }

  typeText(text: string){
    let textIndex = 0;
    let messagesLasIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if(textIndex < text.length){
        this.messages[messagesLasIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
        this.scrollToBottom();
      }
    }, 15)
  }


  scrollToBottom(){
    this.content.scrollToBottom(2000);
  }

}
