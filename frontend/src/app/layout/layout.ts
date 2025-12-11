import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Navbar } from "../shared/navbar/navbar";
import { Header} from "../shared/header/header";
import { Feedback } from "./shared/feedback/feedback";


@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  imports: [RouterOutlet, Header, Feedback],
})
export class Layout {


}
