import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor Dbank {
  stable var currentV : Float = 300;
  // currentV := 300;

  stable var startTime : Int = Time.now();

  // Debug.print(debug_show (startTime));

  public func topUp(amount : Float) {
    currentV += amount;
    Debug.print(debug_show (currentV));
  };

  public func withDraw(amount : Float) {
    let tempV : Float = currentV - amount;
    if (tempV >= 0) {
      currentV -= amount;
      Debug.print(debug_show (currentV));
    } else {
      Debug.print("negative amount");
    };
  };

  public query func checkBalance() : async Float {
    return currentV;
  };

  public func compound() {
    let currentTime = Time.now();
    let timeElapsed = (currentTime - startTime) / 1000000000;
    currentV := currentV * 1.01 ** Float.fromInt(timeElapsed);
    startTime := currentTime;
  };
};
