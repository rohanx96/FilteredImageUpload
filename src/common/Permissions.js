//@flow
import { PermissionsAndroid } from "react-native";

export function requestPermissions(
  permissions,
  onGranted,
  onDenied,
  onDeniedForever
) {
  let checks = [];
  for (let index = 0; index < permissions.length; index++) {
    checks[index] = PermissionsAndroid.check(permissions[index]);
  }
  Promise.all(checks).then(result => {
    let shouldShowRationale = false;
    result.forEach(element => {
      if (!element) {
        shouldShowRationale = true;
      }
    });
    if (shouldShowRationale) {
      PermissionsAndroid.requestMultiple(permissions).then(
        result => {
          var isGranted = true;
          for (var i = 0; i < permissions.length; i++) {
            var resultIndividual = result[permissions[i]];
            if (resultIndividual !== PermissionsAndroid.RESULTS.GRANTED) {
              if (
                resultIndividual === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
              ) {
                onDeniedForever();
                return;
              } else {
                isGranted = false;
              }
            }
          }
          if (isGranted) {
            onGranted();
          } else {
            onDenied();
          }
        },
        error => {}
      );
    } else {
      onGranted();
    }
  });
}
