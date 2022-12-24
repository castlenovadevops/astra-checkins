module.exports = class MsgController{
    constructor(){
        
    }
    
    inputfailed = "Data properites missing. Please check the input"
    emailNotValid = "This email is not valid."
    incorrectEmail = "This email is not exists."
    incorrectPwd = "Invalid password. Please try again later."
    loginmsg = "Logged in successfully."
    regionexist = "This region code already exists."
    emailexist = "This email is already registered as castlenova employee."
    empsave = "Employee details saved successfully";
    cncodeexist = "This code is assigned to an staff. Please try again with a new code."
    macodeexist = "This code is assigned to a master agent. Please try again with a new code."
    acodeexist = "This code is assigned to an agent. Please try again with a new code."
    addnotes = "Verification notes has been saved successfully."
    erroraddnotes = "Verification notes not saved.Please try again later."
    //merchant Registration
    merchantwaitingemailexist="Your business is waiting to be verified. Please wait for confirmation."
    merchantemailexist = "Your email has been already registered with us. Please sign in to your dashboard to request a new business."
    cnemailexist = "This email id is registered as castlenova staff. Please try again with a new email."
    aemailexist = "This email id is registered as agent. Please try again with a new email."
    maemailexist = "This email id is registered as castlenova staff. Please try again with a new email."
    memailexist = "This email id is registered as merchant. Please try again with a new email."
    merchantupdate = "Merchant details updated successfully.";
    merchantsave = "Merchant details saved successfully.";

    assignmsg = "Assigned successfully";
    unassignmsg = "Unassigned successfully"
    rejectMerchant="Merchant rejected successfully."
    deactivatemerchant="Merchant deactivated successfully."

    resetLinksent="Reset link has been mailed to your registered mail id. Please reset your password through the link."
    incorrectLink = "Sorry. This link is not valid."
    expiredlink = "Sorry. This link is expired."


    cnemployeeexist = "This email is registered as castlenova employee. Please try with other email id."
    cnmaexist = "This email is registered as master agent. Please try with other email id."
    cnaexist = "This email is registered as an agent. Please try with other email id."
    memployeeAdminexist = "This email is registered as an admin of other business. Please try with other email id."
    memployeeEmpexist = "This email is registered as an employee of other business. Please try with other email id."
    mempPasscodeExist = "This passcode has been assigned to another user. Please try with new code"
     
    mTaxExist = "This EIN TaxID already registered with us. Please try again with other tax id."
    mDefaultTax = "The following are set as default tax. "
    mproductSkuexists = "This SKU already exists"
    mproductcodeexists = "This product code already exists"

    nouserdetails = "Your details is not registered with us. Please contact admin"
}