const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // SSL pour port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
async function sendValidationEmail(to, code) {
  const mailOptions = {
    from: `"HelloSoin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Votre code de validation",
    text: `Voici votre code de validation : ${code}`,
    html: emailBodyTemplate(to,code),
  };

  await transporter.sendMail(mailOptions);
}

const emailBodyTemplate = (name, tempCode) => `
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Vérification de compte</title>
</head>
<body style="margin:0; padding:0;">
	<center>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top">
								<table width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; width:100%;">
									<tr>
										<td align="center" valign="top">
											<svg width="1017" height="221" viewBox="0 0 1017 221" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M132.925 12.8401V167.966H103.744V103.243H92.1488C61.4325 103.243 29.0115 111.89 29.0115 167.936H0V12.8401H29.0269V106.53C44.9686 81.4949 70.4938 76.6261 87.5106 76.6261C89.6323 76.6281 91.7337 76.2122 93.6947 75.4021C95.6557 74.5919 97.4379 73.4035 98.9397 71.9045C100.441 70.4056 101.633 68.6255 102.447 66.6659C103.261 64.7063 103.681 62.6057 103.683 60.4838V12.8708L132.925 12.8401Z" fill="#405969"/>
<path d="M264.513 126.282C264.513 155.971 245.899 171.268 213.34 171.268C177.448 171.268 155.516 144.452 155.516 108.112C155.516 65.1069 184.973 46.7529 212.004 44.7562C244.133 42.5445 262.286 58.7022 262.286 80.8653C262.286 93.9358 258.754 104.349 241.03 112.106L190.963 133.378C193.185 137.025 196.307 140.041 200.028 142.136C203.75 144.231 207.948 145.335 212.219 145.342C225.304 145.342 235.486 139.798 235.486 126.282H264.513ZM184.758 113.211L225.964 95.487C230.572 93.4904 234.38 91.2787 234.38 85.519C234.38 75.9964 225.073 69.7914 214.415 69.7914C200.454 69.7914 184.513 80.4198 184.513 108.189C184.49 109.867 184.572 111.544 184.758 113.211Z" fill="#405969"/>
<path d="M286.875 167.936V0H314.842V167.936H286.875Z" fill="#405969"/>
<path d="M341.365 167.936V0H369.286V167.936H341.365Z" fill="#405969"/>
<path d="M516.033 106.976C515.774 123.581 508.997 139.42 497.163 151.071C485.329 162.723 469.388 169.254 452.781 169.254C436.174 169.254 420.233 162.723 408.399 151.071C396.565 139.42 389.787 123.581 389.528 106.976C389.528 71.9724 416.559 43.6043 452.681 43.6043C488.803 43.6043 516.033 71.9724 516.033 106.976ZM487.237 106.976C487.237 87.7001 475.273 69.7607 452.681 69.7607C430.089 69.7607 418.263 87.7001 418.263 106.976C418.263 126.021 430.227 143.976 452.604 143.976C474.981 143.976 487.16 126.021 487.16 106.976H487.237Z" fill="#405969"/>
<path d="M516.233 178.533C513.837 176.082 510.648 174.562 507.234 174.247C503.821 173.932 500.407 174.841 497.603 176.813C484.068 186.82 467.574 192.011 450.747 191.56C433.921 191.109 417.729 185.042 404.748 174.325C401.94 172.135 398.422 171.06 394.87 171.307C391.318 171.554 387.983 173.104 385.504 175.661C384.049 177.133 382.919 178.893 382.187 180.829C381.456 182.766 381.139 184.834 381.258 186.9C381.376 188.966 381.928 190.985 382.876 192.824C383.825 194.664 385.149 196.284 386.764 197.579C404.732 212.157 427.018 220.38 450.148 220.966C473.278 221.553 495.952 214.469 514.636 200.819C516.339 199.562 517.752 197.952 518.776 196.1C519.801 194.247 520.414 192.195 520.573 190.083C520.731 187.972 520.433 185.851 519.697 183.866C518.961 181.88 517.806 180.077 516.31 178.579L516.233 178.533Z" fill="#5CA782"/>
<path d="M641.785 121.797C641.785 150.979 617.858 168.596 588.646 168.596C559.435 168.596 535.492 147.447 535.492 118.264H563.029C563.029 133.086 573.78 141.764 589.706 141.764C603.528 141.764 614.279 136.68 614.279 121.797C614.279 90.0346 540.176 111.215 540.176 57.8574C540.176 30.7487 558.805 16.9871 588.017 16.9871C617.228 16.9871 635.827 34.3581 635.827 63.571H608.335C608.335 48.9645 601.132 43.8807 588.001 43.8807C574.87 43.8807 567.683 49.1488 567.683 58.7022C567.683 90.0346 641.785 64.4157 641.785 121.797Z" fill="#5CA782"/>
<path d="M761.64 113.964C761.64 124.769 758.436 135.332 752.434 144.316C746.431 153.3 737.899 160.302 727.917 164.437C717.935 168.572 706.951 169.654 696.354 167.546C685.757 165.438 676.023 160.235 668.383 152.595C660.743 144.954 655.54 135.22 653.432 124.622C651.324 114.025 652.406 103.04 656.541 93.0572C660.676 83.0745 667.678 74.5421 676.661 68.539C685.645 62.536 696.207 59.3319 707.012 59.3319C714.19 59.3157 721.301 60.7177 727.936 63.4575C734.571 66.1973 740.6 70.2208 745.676 75.2971C750.752 80.3734 754.775 86.4024 757.515 93.038C760.255 99.6736 761.657 106.785 761.64 113.964ZM679.92 113.964C679.92 129.63 691.561 141.702 707.227 141.702C722.892 141.702 734.119 129.63 734.119 113.964C734.119 98.2977 722.892 86.2255 707.227 86.2255C691.561 86.2255 679.92 98.2977 679.92 113.964Z" fill="#5CA782"/>
<path d="M773.312 33.2984C773.443 29.0328 775.229 24.9856 778.292 22.0145C781.356 19.0433 785.455 17.3817 789.723 17.3817C793.99 17.3817 798.09 19.0433 801.153 22.0145C804.216 24.9856 806.002 29.0328 806.133 33.2984C806.2 35.4958 805.825 37.6843 805.031 39.7341C804.236 41.7839 803.038 43.6533 801.508 45.2314C799.978 46.8096 798.146 48.0642 796.121 48.921C794.097 49.7778 791.921 50.2193 789.723 50.2193C787.524 50.2193 785.349 49.7778 783.324 48.921C781.3 48.0642 779.468 46.8096 777.937 45.2314C776.407 43.6533 775.209 41.7839 774.414 39.7341C773.62 37.6843 773.245 35.4958 773.312 33.2984ZM789.823 61.0368C793.488 61.0368 797.004 62.4932 799.596 65.0855C802.189 67.6778 803.645 71.1938 803.645 74.8599V167.014H776.062V74.8599C776.062 71.2044 777.509 67.6977 780.088 65.1072C782.667 62.5166 786.167 61.053 789.823 61.0368Z" fill="#5CA782"/>
<path d="M914.116 166.891H886.594V111.215C886.594 94.3198 881.08 86.2256 867.535 86.2256C853.989 86.2256 848.475 94.2737 848.475 111.215V166.891H820.953V111.215C820.953 75.6432 840.428 59.3319 867.535 59.3319C894.642 59.3319 914.116 75.6432 914.116 111.215V166.891Z" fill="#5CA782"/>
<path d="M927.416 131.581H953.187C953.187 138.231 961.496 142.793 972.722 142.793C983.949 142.793 989.755 138.185 989.755 132.825C989.755 115.577 928.46 132.195 928.46 91.0637C928.46 72.7711 947.366 59.6852 971.463 59.6852C995.56 59.6852 1013.85 71.742 1013.85 93.7515H988.096C988.096 87.7308 979.987 83.5838 971.049 83.5838C962.11 83.5838 955.475 87.7308 955.475 93.1371C955.475 108.097 1016.35 94.1816 1016.77 133.439C1016.97 156.708 997.434 166.891 972.093 166.891C948.825 166.891 927.416 154.85 927.416 131.581Z" fill="#5CA782"/>
</svg>

										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">
								Bonjour ${name},
							</td>
						</tr>
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size: 18px; font-family: Arial, sans-serif;">
								<p>Voici votre code de vérification temporaire :</p>
								<div style="font-size: 24px; font-weight: bold; color: #28a745; margin: 1rem 0;">${tempCode}</div>
								<p>Ce code est valable pour une durée limitée. Ne le partagez pas.</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px;">
								<a href="https://votreclinique.com/verification" style="background-color:#28a745; color:#ffffff; font-size:18px; font-weight:bold; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
									Vérifier mon compte
								</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size:14px; color:#777; font-family: Arial, sans-serif;">
								<p>Si vous n'avez pas demandé ce code, ignorez cet e-mail.</p>
								<p>Besoin d'aide ? Contactez-nous à <a href="mailto:support@votreclinique.com" style="color:#28a745; text-decoration:none;">support@votreclinique.com</a></p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</center>
</body>
</html>


`;

module.exports = sendValidationEmail;
