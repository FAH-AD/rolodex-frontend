export const UnknownView = () => {
  console.log(window.location.href);
  const params = new URLSearchParams(window.location.search);
  const callbackUrl = params.get('callback');
  if (callbackUrl) {
    window.location.href = callbackUrl;
  }
  else {
    window.location.href = "/dashboard";
  }
  return (
    <></>
  );
};
