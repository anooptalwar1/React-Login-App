import React from 'react';
import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default function TextFieldPassword(props) {

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <div>
                <FormControl variant='outlined' fullWidth required>
                    <InputLabel htmlFor='password'>{props.label}</InputLabel>
                    <OutlinedInput
                        type={props.password.show ? 'text' : 'password'}
                        value={props.password.value}
                        error={!props.password.valid}
                        onChange={(event) => props.onPasswordChange(event)}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton onClick={props.onShowPassword} onMouseDown={handleMouseDown} edge='end' >
                                    {props.password.show ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        labelWidth={props.labelWidth}
                    />
                </FormControl>
            </div>
        </div>
    );
}
