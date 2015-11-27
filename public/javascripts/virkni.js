var gvista = document.querySelector('button.vista');
var faersla=document.querySelector('.faerslur');
var ord = document.querySelector('input.titill')
var texti=document.getElementById('texti');
var hreinsa = document.querySelector('button.hreinsa');
var total = document.querySelector('.total');
var rem = document.querySelector('.rem');
var snua = document.querySelector('button.snua');
var eydat= document.querySelector('button.eyda');
snua.addEventListener('click', snuastofum);
texti.addEventListener('keyup', handleKeyUp);

setup();


function setup(){
  if(document.querySelector('h1.hidden').childNodes[0]){
  var texx=document.querySelector('h1.hidden').childNodes[0].nodeValue;
  var tiitle=document.querySelector('h2.hidden').childNodes[0].nodeValue;
  var dayte=document.querySelector('h3.hidden').childNodes[0].nodeValue;
  texx=texx.split(',');
  tiitle=tiitle.split(',');
  dayte=dayte.split(',');
  var j=tiitle.length-1;
    while(j>=0) {
      faersla.appendChild(el(tiitle[j], texx[j], dayte[j]));
      buaTilTakka(ord.value);
      j--;
    }
  }
  else{
    var k = document.createElement('button');
    k.className="btn btn-default list-group-item";
    k.id="dummy";
    var x = document.createTextNode("Ekki til í skrá");
    k.appendChild(x);
    faersla.appendChild(k);
    buaTilTakka("dummy");
  }
    ord.value="";
  texti.value="";
  }


function snuastofum(){
  console.log(document.querySelector('h1.hidden').childNodes[0].nodeValue);
  console.log(document.querySelector('h2.hidden').childNodes[0].nodeValue);
  console.log(document.querySelector('h3.hidden').childNodes[0].nodeValue);
  var str = texti.value;
  var strReverse = str.split('').reverse().join('');
  texti.value=strReverse;
}


function buaTilTakka(x){
  var takki = document.getElementById(x);
  takki.addEventListener('click', dalkar);
}

function handleKeyUp(){
  total.innerHTML = texti.value.length;
  rem.innerHTML = texti.value.split(' ').length;
};

hreinsa.addEventListener('click', function(e) {
  var x = texti.value; 
  x=x.split('');
  var i = 0;
  while(i < x.length){
    if(x[i]=="<"){
      while(x[i]!=">"){
        x[i]="";
        i++;
      }
      x[i]="";
    }
    i++;
  }
  texti.value=x.join('');
})


function el(elementName, text, dags) {
  if(elementName==[]) return;
  var o = document.createElement('button');
  o.className="btn btn-default list-group-item";
  o.id=elementName;
  ord.value=elementName;
  if(dags){
    dags=document.createTextNode(dags);
    o.appendChild(dags);
  }
  else{
    var datetime=new Date().toLocaleString();
    var datetimeComponents = datetime.split(' ');
    var dateComponents = datetimeComponents[0].split('/');
    var day=dateComponents[1];
    var month=dateComponents[0];
    var year=dateComponents[2].slice(0,-1);
    dateComponents[0]=day;
    dateComponents[1]=month;
    dateComponents[2]=year;
    dateComponents=dateComponents.join('.');
    datetimeComponents[0]=dateComponents;
    datetimeComponents[2]="";
    datetimeComponents=datetimeComponents.join(' ');
    var tim = document.createElement('p');
    var timi = document.createTextNode(datetimeComponents);
    tim.appendChild(timi);
    o.appendChild(tim);
  }
  var header = document.createElement('p');
  var headerText = document.createTextNode(elementName);
  header.appendChild(headerText);
  o.appendChild(header);
  var texxas = document.createElement('p');
  var tex = document.createTextNode(text);
  texxas.appendChild(tex);
  texxas.className='hidden';
  o.appendChild(texxas);
  return o;
};

function dalkar(){
  var x = this.id;
  ord.value=x;
  x=document.getElementById(x);
  texti.value=x.lastChild.childNodes[0].data;
};  