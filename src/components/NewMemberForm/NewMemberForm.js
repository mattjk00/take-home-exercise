import { useState } from 'react';
import './NewMemberForm.css';
import url from 'url';

/**
 * Simple data structure used for building and validating the form fields.
 */
const fields = [
    {   name:'firstName',
        display:'First Name',
        placeholder:'John',
        required:true },

    {   name:'lastName',
        display:'Last Name',
        placeholder:'Smith',
        required:true },
        
    {   name:'title',
        display:'Title',
        placeholder:'Manager',
        required:true },
        
    {   name:'story',
        display:'Story',
        placeholder:'Once Upon a Time...',
        required:true },
        
    {   name:'favoriteColor',
        display:'Favorite Color',
        placeholder:'Blue',
        required:false },
        
    {   name:'photoUrl',
        display:'Photo URL',
        placeholder:'...',
        required:false },
        
];

export default function NewMemberForm({close, postNewMember}) {

    const [inputs, setInputs] = useState({});   // Form fields stored here
    const [errors, setErrors] = useState([]);   // Store form errors here

    /**
     * Is called when any input field is changed. Changes are stored in the inputs state dictionary.
     * @param {Event} e 
     */
    function inputChanged(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        inputs[name] = value;
        setInputs(inputs);
    }

    /**
     * Client side form validation. Checks that the required fields are not empty or blank and also checks to see if the photo URL is valid.
     * @returns 
     */
    function validateForm() {
        let errs = [];

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const val = inputs[field.name];
            const isBlank = (!val || !val.trim().length);

            if (field.required && isBlank) {
                errs.push(field.display + ' cannot be left blank.');
            }
            // If a photo URL is required, check to see if it is valid.
            else if (!field.required && field.name === 'photoUrl' && !isBlank) {
                let u = null;
                try {
                    u = url.parse(val);
                } catch (e){}
                
                if (u === null || !u.hostname) {
                    errs.push('Invalid Photo URL');
                }
                console.log(u);
            }
        }

        return errs;
    }

    /**
     * Is called when the submit button is pressed. First checks for any form errors and then will attempt to POST the data.
     */
    async function processForm() {
        let err = validateForm();
        setErrors(err);

        if (err.length === 0) { // No Errors
            
            const newMemberData = { 
                firstName:      inputs['firstName'],
                lastName:       inputs['lastName'],
                title:          inputs['title'],
                story:          inputs['story'],
                favoriteColor:  inputs['favoriteColor'],
                photoUrl:       inputs['photoUrl']
            };

            postNewMember(newMemberData);
        }
    }

    return (
        <div id="modal" className='fade-in'>
            <div id="container" className='slide-in-top'>
                <h2>New Team Member</h2>
                <div className='closeButton' onClick={close}>X</div>
                <div className='tbl'>
                    <table>
                        <tbody>
                            {fields.map(f => (
                                <tr key={f.name}>
                                    <td><p>{f.display}</p></td>
                                    <td><input type='text' placeholder={f.placeholder} name={f.name} onChange={inputChanged}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className='submit' onClick={processForm}>Submit</button>
                <ul className='errorList'>
                    {errors.map(e => (
                        <li className='error'>{e}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}