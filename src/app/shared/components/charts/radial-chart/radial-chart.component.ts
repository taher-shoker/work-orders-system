import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from "ng-apexcharts";

@Component({
  selector: "app-radial-chart",
  templateUrl: "./radial-chart.component.html",
  styleUrls: ["./radial-chart.component.css"],
  standalone: true,
  imports: [NgApexchartsModule, TranslateModule],
})
export class RadialChartComponent implements OnInit, OnChanges {
  @Input() data: number[] = [];

  public series: ApexNonAxisChartSeries = [];
  public labels: string[] = [];
  public subtitle!: ApexTitleSubtitle;
  isRtl = false;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.setupChartText();
    this.updateChartData(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && !changes["data"].firstChange) {
      this.updateChartData(changes["data"].currentValue);
    }
  }

  private setupChartText() {
    this.isRtl = localStorage.getItem("lang") !== "en";

    this.labels = [
      this.translate.instant("charts.opened"),
      this.translate.instant("charts.in_progress"),
      this.translate.instant("charts.completed"),
      this.translate.instant("charts.holding"),
      this.translate.instant("charts.closed"),
    ];

    const title = this.translate.instant("charts.distrbute_work_orders");

    this.subtitle = {
      text: title,
      align: this.isRtl ? "right" : "left",
      margin: 10,
      style: {
        fontSize: "25px",
        color: "#3c3d41ff",
      },
    };
  }

  private updateChartData(data: number[]) {
    if (data && data.length) {
      this.series = [...data]; // force chart refresh
    }
  }
  public responsive: ApexResponsive[] = [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 768, // Mobiles
      options: {
        chart: {
          height: 300,
          width: 350,
        },
        subtitle: {
          // offsetX: -70,
          offsetY: -5,

          style: {
            fontSize: "12px",
            color: "#3c3d41ff",
            algin: "center",
          },
        },
      },
    },
  ];
  public chart: ApexChart = {
    height: 310,
    type: "donut",
    foreColor: "#ffff",
  };
  public dataLabels: ApexDataLabels = {
    enabled: true,
    enabledOnSeries: undefined,
    textAnchor: "middle",
    distributed: true,
    offsetX: 0,
    offsetY: 0,
    style: { fontSize: "12px", fontWeight: "bold", colors: ["#fff"] },
    background: {
      enabled: false,
      foreColor: "#fff",
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: "#fff",
      opacity: 0.9,
    },
    dropShadow: { enabled: false },
  };
  public colors: string[] = [
    "#0020eeff",
    "#0aa3e4ff",
    "#05a26bff",
    "#22068fff",
    "#6c0378ff",
  ];

  public legend: ApexLegend = {
    show: true,
    position: "bottom",
  };
}
