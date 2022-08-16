import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { gyroscope } from "react-native-sensors";
import EdnsJson from './edns.json';

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

class AnimatedFox extends PureComponent {

	constructor(props) {
		super(props);

		this.position = {
			beta: 0,
			gamma: 0
		};

		this.subscription = gyroscope.subscribe(({ x, y}) => {

			this.position = {
				beta: this.position.beta - round(x*-10, 4),
				gamma: this.position.gamma - round(y*-10,4)
			}


			requestAnimationFrame(() => {
				const JS = `
					(function () {
						const event = new CustomEvent('nativedeviceorientation', {
							detail: {
								alpha:${this.position.alpha},
								beta:${this.position.beta},
								gamma:${this.position.gamma}
							}
						});

						window.dispatchEvent(event);
					})();
				`;
				const { current } = this.webview;
				current && current.injectJavaScript(JS);
			});
		},() => {
			//Nothing to do here, sensor not available
		});
	}

    componentWillUnmount(){
        this.subscription.unsubscribe();
	}


	webview = React.createRef();

	render() {
		return (
			<WebView
				ref={this.webview}
				style={{ flex: 1 }}
				source={{html:`
					<!DOCTYPE html>
					<html>
					<head>
					<style>
					html, body{
						height: 100%;
					}

					body{
						background: ${this.props.bgColor};
						text-align: center;
						color: white;
						font-family: roboto;
						overflow: hidden;
					}

					div{
						height:50px;
						overflow: visible;
					}

					svg {
						overflow: visible;
						margin-top: -53px;
						margin-left: -10px;
					}
					</style>
					<title>---</title>
					<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
					<meta charset=utf-8></head>
					<body>
					<div></div>
					<script>
						(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
						const createViewer=require("../index"),viewer=createViewer({width:1,height:1,followMouse:!0,followMotion:!0});document.body.appendChild(viewer.container);
						},{"../index":3}],2:[function(require,module,exports){
						module.exports= ${JSON.stringify(EdnsJson)}

						},{}],3:[function(require,module,exports){
						function createNode(t){return document.createElementNS(SVG_NS,t)}function setAttribute(t,e,n){t.setAttributeNS(null,e,n)}var perspective=require("gl-mat4/perspective"),multiply=require("gl-mat4/multiply"),lookAt=require("gl-mat4/lookAt"),invert=require("gl-mat4/invert"),rotate=require("gl-mat4/rotate"),transform=require("gl-vec3/transformMat4"),foxJSON=require("./fox.json"),SVG_NS="http://www.w3.org/2000/svg";module.exports=function(t){function e(t){var e=y.getBoundingClientRect();x.x=1-2*(t.x-e.left)/e.width,x.y=1-2*(t.y-e.top)/e.height}function n(t,e){this.svg=t,this.indices=e,this.zIndex=0}function i(t){for(var e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],u=t[7],h=t[8],s=t[9],d=t[10],f=t[11],w=t[12],c=t[13],g=t[14],v=t[15],m=0;m<F;++m){var p=N[3*m],A=N[3*m+1],y=N[3*m+2],x=p*r+A*u+y*f+v;M[3*m]=(p*e+A*o+y*h+w)/x,M[3*m+1]=(p*n+A*a+y*s+c)/x,M[3*m+2]=(p*i+A*l+y*d+g)/x}}function r(t,e){return e.zIndex-t.zIndex}function o(){var t,e=y.getBoundingClientRect(),n=e.width,i=e.height;for(b.length=0,t=0;t<S.length;++t){var o=S[t],a=o.indices,l=a[0],u=a[1],h=a[2],s=M[3*l],d=M[3*l+1],f=M[3*u],w=M[3*u+1],c=M[3*h];if(!((f-s)*(M[3*h+1]-d)-(w-d)*(c-s)<0)){for(var g=[],v=-1/0,m=1/0,p=o.svg,A=0;A<3;++A){var x=a[A];g.push(.5*n*(1-M[3*x])+","+.5*i*(1-M[3*x+1]));var F=M[3*x+2];v=Math.max(v,F),m=Math.min(m,F)}o.zIndex=v+.25*m;var N=g.join(" ");-1===N.indexOf("NaN")&&setAttribute(p,"points",N),b.push(o)}}for(b.sort(r),y.innerHTML="",t=0;t<b.length;++t)y.appendChild(b[t].svg)}function a(){g=!1}function l(){g=!0}function u(t){f=t}function h(t){w=t}function s(){if(g){window.requestAnimationFrame(s);var t=1-m;y.getBoundingClientRect();v[0]=t*v[0]+m*x.x,v[1]=t*v[1]+m*x.y+.085;i(k()),o(),a()}}var d=t||{},f=!!d.followMouse,w=!!d.followMotion,c=!!d.slowDrift,g=!0,v=[0,0],m=.3,p=d.width||400,A=d.height||400,y=createNode("svg"),x={x:0,y:0},F=foxJSON.positions.length,N=new Float32Array(3*F),M=new Float32Array(3*F),b=[];d.pxNotRatio||(p=window.innerWidth*(d.width||.25)|0,A=0|(window.innerHeight*d.height||p),"minWidth"in d&&p<d.minWidth&&(p=d.minWidth,A=d.minWidth*d.height/d.width|0)),setAttribute(y,"width",p+"px"),setAttribute(y,"height",A+"px"),document.body.appendChild(y),function(){for(var t=foxJSON.positions,e=0,n=0;n<t.length;++n)for(var i=t[n],r=0;r<3;++r)N[e++]=i[r]}();var S=function(){for(var t=[],e=0;e<foxJSON.chunks.length;++e)for(var i=foxJSON.chunks[e],r="rgb("+i.color+")",o=i.faces,a=0;a<o.length;++a){var l=o[a],u=createNode("polygon");setAttribute(u,"fill",r),setAttribute(u,"stroke",r),setAttribute(u,"points","0,0, 10,0, 0,10"),y.appendChild(u),t.push(new n(u,l))}return t}(),k=function(){var t=new Float32Array(3),e=new Float32Array([0,1,0]),n=new Float32Array(16),i=new Float32Array(16),r=lookAt(new Float32Array(16),new Float32Array([0,0,400]),t,e),o=invert(new Float32Array(16),r),a=new Float32Array(16),l=new Float32Array(3),u=new Float32Array(16),h=new Float32Array([1,0,0]),s=new Float32Array([0,1,0]),d=new Float32Array([0,0,1]);return function(){var f=y.getBoundingClientRect(),w=f.width,g=f.height;if(perspective(n,Math.PI/4,w/g,100,1e3),invert(a,n),l[0]=v[0],l[1]=v[1],l[2]=1.2,transform(l,l,a),transform(l,l,o),lookAt(i,t,l,e),c){var m=Date.now()/1e3;rotate(i,i,.1+.2*Math.sin(m/3),h),rotate(i,i,.03*Math.sin(m/2)-.1,d),rotate(i,i,.5+.2*Math.sin(m/3),s)}return multiply(u,n,r),multiply(u,u,i),u}}();window.addEventListener("mousemove",function(t){g||l(),f&&(e({x:t.clientX,y:t.clientY}),s())});const q=window.innerWidth,C=window.innerHeight,O=q/2,W=C/2,I=1.2*C;var J=0,R=0;
						return window.addEventListener("nativedeviceorientation",function(t){if(g||l(),w){if(!R)return R=t.detail.beta,void(J=t.detail.gamma);e({x:O+0.5*(J-t.detail.gamma),y:Math.max(Math.min(W+0.5*(R-t.detail.beta),I),0)}),s()}}),s(),{container:y,lookAt:e,setFollowMouse:u,setFollowMotion:h,stopAnimation:a,startAnimation:l}};
						},{"./fox.json":2,"gl-mat4/invert":5,"gl-mat4/lookAt":6,"gl-mat4/multiply":7,"gl-mat4/perspective":8,"gl-mat4/rotate":9,"gl-vec3/transformMat4":10}],4:[function(require,module,exports){
						function identity(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}module.exports=identity;
						},{}],5:[function(require,module,exports){
						function invert(n,r){var e=r[0],t=r[1],u=r[2],i=r[3],l=r[4],o=r[5],v=r[6],a=r[7],c=r[8],d=r[9],f=r[10],m=r[11],p=r[12],s=r[13],x=r[14],b=r[15],g=e*o-t*l,h=e*v-u*l,j=e*a-i*l,k=t*v-u*o,q=t*a-i*o,w=u*a-i*v,y=c*s-d*p,z=c*x-f*p,A=c*b-m*p,B=d*x-f*s,C=d*b-m*s,D=f*b-m*x,E=g*D-h*C+j*B+k*A-q*z+w*y;return E?(E=1/E,n[0]=(o*D-v*C+a*B)*E,n[1]=(u*C-t*D-i*B)*E,n[2]=(s*w-x*q+b*k)*E,n[3]=(f*q-d*w-m*k)*E,n[4]=(v*A-l*D-a*z)*E,n[5]=(e*D-u*A+i*z)*E,n[6]=(x*j-p*w-b*h)*E,n[7]=(c*w-f*j+m*h)*E,n[8]=(l*C-o*A+a*y)*E,n[9]=(t*A-e*C-i*y)*E,n[10]=(p*q-s*j+b*g)*E,n[11]=(d*j-c*q-m*g)*E,n[12]=(o*z-l*B-v*y)*E,n[13]=(e*B-t*z+u*y)*E,n[14]=(s*h-p*k-x*g)*E,n[15]=(c*k-d*h+f*g)*E,n):null}module.exports=invert;

						},{}],6:[function(require,module,exports){
						function lookAt(t,a,e,r){var i,o,s,h,n,M,d,q,u,b,l=a[0],y=a[1],k=a[2],v=r[0],A=r[1],c=r[2],f=e[0],m=e[1],p=e[2];return Math.abs(l-f)<1e-6&&Math.abs(y-m)<1e-6&&Math.abs(k-p)<1e-6?identity(t):(d=l-f,q=y-m,u=k-p,b=1/Math.sqrt(d*d+q*q+u*u),d*=b,q*=b,u*=b,i=A*u-c*q,o=c*d-v*u,s=v*q-A*d,b=Math.sqrt(i*i+o*o+s*s),b?(b=1/b,i*=b,o*=b,s*=b):(i=0,o=0,s=0),h=q*s-u*o,n=u*i-d*s,M=d*o-q*i,b=Math.sqrt(h*h+n*n+M*M),b?(b=1/b,h*=b,n*=b,M*=b):(h=0,n=0,M=0),t[0]=i,t[1]=h,t[2]=d,t[3]=0,t[4]=o,t[5]=n,t[6]=q,t[7]=0,t[8]=s,t[9]=M,t[10]=u,t[11]=0,t[12]=-(i*l+o*y+s*k),t[13]=-(h*l+n*y+M*k),t[14]=-(d*l+q*y+u*k),t[15]=1,t)}var identity=require("./identity");module.exports=lookAt;

						},{"./identity":4}],7:[function(require,module,exports){
						function multiply(l,t,u){var r=t[0],e=t[1],i=t[2],m=t[3],n=t[4],o=t[5],p=t[6],y=t[7],a=t[8],c=t[9],d=t[10],f=t[11],s=t[12],v=t[13],x=t[14],b=t[15],g=u[0],h=u[1],j=u[2],k=u[3];return l[0]=g*r+h*n+j*a+k*s,l[1]=g*e+h*o+j*c+k*v,l[2]=g*i+h*p+j*d+k*x,l[3]=g*m+h*y+j*f+k*b,g=u[4],h=u[5],j=u[6],k=u[7],l[4]=g*r+h*n+j*a+k*s,l[5]=g*e+h*o+j*c+k*v,l[6]=g*i+h*p+j*d+k*x,l[7]=g*m+h*y+j*f+k*b,g=u[8],h=u[9],j=u[10],k=u[11],l[8]=g*r+h*n+j*a+k*s,l[9]=g*e+h*o+j*c+k*v,l[10]=g*i+h*p+j*d+k*x,l[11]=g*m+h*y+j*f+k*b,g=u[12],h=u[13],j=u[14],k=u[15],l[12]=g*r+h*n+j*a+k*s,l[13]=g*e+h*o+j*c+k*v,l[14]=g*i+h*p+j*d+k*x,l[15]=g*m+h*y+j*f+k*b,l}module.exports=multiply;

				},{}],8:[function(require,module,exports){
				function perspective(e,t,r,p,n){var a=1/Math.tan(t/2),c=1/(p-n);return e[0]=a/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=(n+p)*c,e[11]=-1,e[12]=0,e[13]=0,e[14]=2*n*p*c,e[15]=0,e}module.exports=perspective;
				},{}],9:[function(require,module,exports){
				function rotate(t,a,r,e){var o,n,s,h,u,M,l,c,i,b,d,f,m,p,q,v,x,g,j,k,w,y,z,A,B=e[0],C=e[1],D=e[2],E=Math.sqrt(B*B+C*C+D*D);return Math.abs(E)<1e-6?null:(E=1/E,B*=E,C*=E,D*=E,o=Math.sin(r),n=Math.cos(r),s=1-n,h=a[0],u=a[1],M=a[2],l=a[3],c=a[4],i=a[5],b=a[6],d=a[7],f=a[8],m=a[9],p=a[10],q=a[11],v=B*B*s+n,x=C*B*s+D*o,g=D*B*s-C*o,j=B*C*s-D*o,k=C*C*s+n,w=D*C*s+B*o,y=B*D*s+C*o,z=C*D*s-B*o,A=D*D*s+n,t[0]=h*v+c*x+f*g,t[1]=u*v+i*x+m*g,t[2]=M*v+b*x+p*g,t[3]=l*v+d*x+q*g,t[4]=h*j+c*k+f*w,t[5]=u*j+i*k+m*w,t[6]=M*j+b*k+p*w,t[7]=l*j+d*k+q*w,t[8]=h*y+c*z+f*A,t[9]=u*y+i*z+m*A,t[10]=M*y+b*z+p*A,t[11]=l*y+d*z+q*A,a!==t&&(t[12]=a[12],t[13]=a[13],t[14]=a[14],t[15]=a[15]),t)}module.exports=rotate;

				},{}],10:[function(require,module,exports){
				function transformMat4(r,t,a){var n=t[0],o=t[1],e=t[2],f=a[3]*n+a[7]*o+a[11]*e+a[15];return f=f||1,r[0]=(a[0]*n+a[4]*o+a[8]*e+a[12])/f,r[1]=(a[1]*n+a[5]*o+a[9]*e+a[13])/f,r[2]=(a[2]*n+a[6]*o+a[10]*e+a[14])/f,r}module.exports=transformMat4;

				},{}]},{},[1]);

					</script>
					</body>
					</html>
				`}}
				javaScriptEnabled
				bounces={false}
				scrollEnabled={false}
				injectedJavaScript={`document.body.style.background="${this.props.bgColor}"`}
			/>
		)
	}

}

AnimatedFox.propTypes = {
		/**
		/* String that represents the background color
		*/
		bgColor: PropTypes.string
}
AnimatedFox.defaultProps = {
	bgColor: 'white'
}

export default AnimatedFox;
