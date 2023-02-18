import { Component } from '@angular/core';
import jsPDF, { jsPDFOptions } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  users:any = [];
  cbxPwd = false;
  cbxAddNewPage = false;
  cbxAddHtmlTable = false;
  cbxAddImage = false;
  dataUri:any;

  constructor(){

  }
  ngOnInit(){
    this.setup();
    this.preview();
  }
  setup(){
    this.users = this.getSampleData();
  }
  async preview(){
    //add the checked sections
    //generate pdf
    //get base64 and embed
    const options:jsPDFOptions = {
      unit: 'mm', // set the unit of measurement to px
      format: 'a4', // set your paper size format
    }
    if (this.cbxPwd) options.encryption = {
      userPassword:"demo",
      ownerPassword:"demo",
      userPermissions: ["print", "modify", "copy", "annot-forms"]
    };
    let doc = new jsPDF(options);
    //add main cover page stuff
    doc.setFontSize(22);
    const midPage = doc.internal.pageSize.getWidth()/2;
    doc.setTextColor(0, 0, 255);
    doc.text("Sample PDF", midPage, 20, {align:"center"});
    doc.setTextColor(0, 0, 0);

    if (this.cbxAddHtmlTable){
      await this.addHtmlasImage(doc);
    }
    if (this.cbxAddNewPage){
      this.addNewPage(doc);
    }
    if (this.cbxAddImage){
      this.addImage(doc);
    }

    var blob = doc.output('blob');
    const link = URL.createObjectURL(blob);
    document.getElementById("preview")?.setAttribute("src", link); 
  }
  async addHtmlasImage(doc:jsPDF){
    doc.addPage();
    let DATA: any = document.getElementById('htmlTable');
    await html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let position = 0;
      doc.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    });
  }
  addNewPage(doc:jsPDF){
    doc.addPage();
    doc.setFontSize(22);
    let content:any = document.getElementById("newPageContent")?.innerHTML;
    //every 10th word, add the line break
    const split = content.split(" ");
    let wordcount = 5;
    while (wordcount < split.length){
      split[wordcount] += "\n";
      wordcount += 5;
    }
    doc.text(split.join(" "), 20, 20);
  }
  addImage(doc:jsPDF){
    const midPage = doc.internal.pageSize.getWidth()/2;
    doc.addPage();
    doc.setFontSize(40);
    doc.text("GT love jsPDF", midPage, 25, {align:"center"});
    doc.addImage("assets/Octonyan.jpg", "JPEG", 15, 40, 180, 180);
  }

  getSampleData(){
    return [
      {
        "id": 1,
        "name": "Leanne Graham",
        "email": "sincere@april.biz",
        "phone": "1-770-736-8031 x56442"
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "email": "shanna@melissa.tv",
        "phone": "010-692-6593 x09125"
      },
      {
        "id": 3,
        "name": "Clementine Bauch",
        "email": "nathan@yesenia.net",
        "phone": "1-463-123-4447",
      },
      {
        "id": 4,
        "name": "Patricia Lebsack",
        "email": "julianne@kory.org",
        "phone": "493-170-9623 x156"
      },
      {
        "id": 5,
        "name": "Chelsey Dietrich",
        "email": "lucio@annie.ca",
        "phone": "(254)954-1289"
      },
      {
        "id": 6,
        "name": "Mrs. Dennis",
        "email": "karley@jasper.info",
        "phone": "1-477-935-8478 x6430"
      }
    ];
  }
}
