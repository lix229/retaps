"use client";

import {Button} from "@nextui-org/react";
import {Card, CardBody, Image} from '@nextui-org/react';
import {Input} from "@nextui-org/react"; 
import {useState} from 'react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const correctEmail = "gator@ufl.edu";
  const correctPassword = "password";

  const handleLogin = () => {
    if ((email === correctEmail) && (password === correctPassword)) {
      window.location.href = "http://portal.admin.ufl.edu";
    } else {
      alert('Invalid email or password!');
    }
  }

  return (
    <div className="flex h-[calc(100vh-90px)]">

      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center p-4">
        <div className="mb-4 p-1" style={{fontFamily: 'Palatino, Palatino Linotype, serif'}}> 
          Login to access your account: 
        </div>
        <div className="flex flex-col space-y-4" style={{fontFamily: 'Palatino, Palatino Linotype, serif'}}>
          <Input 
            isRequired 
            type="email" 
            label="Email" 
            placeholder="Enter your email" 
            value = {email}
            onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <Input 
            isRequired 
            type="password" 
            label="Password" 
            placeholder="Enter your password" 
            value = {password}
            onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-4" style={{fontFamily: 'Palatino, Palatino Linotype, serif'}}>
            <Button color="black" variant="ghost" onClick={handleLogin}>
              <p className="primary"> Login </p>
            </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center p-4">
        <Card className="w-full h-full">
          <Image
              removeWrapper
              isBlurred
              style = {{opacity : "0.75"}}
              alt = "Parking Permits"
              className = "w-full h-full object-cover rounded-none"
              src = "/assets/gator_image.jpg"
            />
          {/* <CardBody style={{fontFamily: 'Palatino, Palatino Linotype, serif'}}> hi</CardBody> */}
        </Card>
      </div>
    </div>
  );
}