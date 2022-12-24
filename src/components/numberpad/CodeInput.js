import React from 'react'; 
import { InputBase } from "@material-ui/core";

class CodeInput extends React.Component {

 

  constructor(props) {
    super(props);

    this.state={
      codeLength : Number(props.codeLength),
      codeValue : ['','','',''],
      input: [],
      enabled: [true,false,false,false],
      isReached: false
    }
    
    this.onChange = this.onChange.bind(this)

  }

  componentDidMount(){
    const tinput = []
    for (var i = 0; i <= this.state.codeLength-1; i++) {
      
      tinput.push('')
    } 
    this.setState({input: tinput}, function() {
      // //// console.log("codeLength::",this.state.input.length)
    })

  }
  
  componentWillReceiveProps({codeValueArray}) {
   
    
   

  }

  updateValue(codeValueArray){
    // //// console.log("componentWillReceiveProps::",codeValueArray.length)

    if(codeValueArray === 0) { //**clear inputs */
      this.setState({codeValue: ['','','','']})

    }
    else {
      const index = codeValueArray.length-1; 
     
       this.setState({codeValue: codeValueArray}, function() { 
         //// console.log(codeValueArray.length , this.state.codeLength)
          if(codeValueArray.length === this.state.codeLength) { 
            this.setState({isReached: true}) 
            this.props.onSubmitPasscode(this.state.codeValue)
            
          } 
          
       })
  
       const id = "#field-"+(index+1)
       const nextfield = document.querySelector("[name='"+id+"']")
       if(nextfield != null) {
         (nextfield ).focus();
       }
    }
  }


  onChange(e){
    
    const index = Number(e.target.id);
    const tempCodeValue = this.state.codeValue
    const tdisabled = this.state.enabled
    
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      tempCodeValue[index] = e.target.value
      // tdisabled[index]=false
      if(index+1 < this.state.codeLength) {
        tdisabled[index+1] = true
      }
       this.setState({codeValue: tempCodeValue, enabled: tdisabled}, function() {
       })
    }
    if(index+1 === this.state.codeLength) {
      this.props.onSubmitPasscode(this.state.codeValue)
    }
   
    const id = "#field-"+(index+1)
    const nextfield = document.querySelector("[name='"+id+"']")
    if(nextfield != null) {
      (nextfield ).focus();
    }
 }


  render() {
    
    return (
     
      <div style={{   width: '100%',margin: '10px',height: '50px',display: 'inline-block' }} >
        
        <div style={{border: 'solid 0px #000',  textAlign: 'center',margin: '0px auto'}}>
        
    
       {this.state.input.map((value, i) => {
         value = ""
         if (typeof(this.state.codeValue[i]) !== 'undefined' && this.state.codeValue[i] != null) {
            value = this.state.codeValue[i]
         }
        
         return(
          <div key={'codeinput'+i} style={{ background: '#ffffff', width: '30px', height: '30px', padding: '0px',border: '1px solid #134163 ',
          borderRadius: '15px',display: 'inline-block',marginLeft: 10,marginRight: 10,justifyContent: 'center', marginTop: 10,textAlign: 'center' }} >

          <InputBase 
              type='password' 
              onKeyDown={(e)=>{ 
                const pattern = /^[0-9]$/;  
                    if(!pattern.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
              }}
              fullWidth 
              name={"#field-" +i}
              id={i}  
              value={value}
              inputProps={{ maxLength: 1,disableUnderline: true,min: 0, style: { textAlign: 'center',cursor: 'none', color: '#134163'  }}}
              onChange={this.onChange}
              autoFocus={this.state.enabled[i]}
              style={{cursor: 'none', caretColor: 'transparent', fontSize: 25, height: 30, marginTop: 1}}
              ref={i}
          />


        </div>
         )
       })}
       </div>
      </div>
      
    );
  }
}

export default CodeInput;