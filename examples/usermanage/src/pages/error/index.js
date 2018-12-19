import React from 'react';

export default props => {
  const {
    location: { query: { error:{data,name,message,stack}, params, url } }
  } = props;
  return (
    <div>
      <h1>url</h1>
      <p>{url}</p>
      <h1>params</h1>
      <p>{JSON.stringify(params)}</p>
      <h1>error_data</h1>
      <p>{JSON.stringify(data)}</p>
      <h1>error_name</h1>
      <p>{name}</p>
      <h1>error_message</h1>
      <p>{message}</p>
      <h1>error_stack</h1>
      <p>{stack}</p>
    </div>
  )
}


// data: {exception_type: "internal_error", name: "builtins.TypeError", debug: "Traceback (most recent call last):↵  File "/opt/od… missing 1 required positional argument: 'login'↵", message: "login() missing 1 required positional argument: 'login'", arguments: Array(1)}